import os
import requests
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, TypeAdapter, ValidationError
from PIL import Image
from io import BytesIO
from google import genai
from google.genai import types
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from src.prompt import fake_detection_prompt, fake_parser, FakeDetectionOutput
from src.rag import query_rag

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
)

MAX_MESSAGES = 20
user_sessions: dict = {}


class TextExtractorModel:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "gemini-2.5-flash"

    def _validate_url(self, file_url: str) -> str:
        adapter = TypeAdapter(AnyHttpUrl)
        try:
            return str(adapter.validate_python(file_url))
        except ValidationError as e:
            raise ValueError(f"Invalid URL: {file_url}") from e

    def extract_text_from_url(self, file_url: str) -> str:
        validated_url = self._validate_url(file_url)

        response = requests.get(validated_url)
        response.raise_for_status()

        content_type = response.headers.get("Content-Type", "")
        is_pdf = "pdf" in content_type or file_url.lower().endswith(".pdf")

        if is_pdf:
            mime_type = "application/pdf"
        else:
            try:
                Image.open(BytesIO(response.content)).convert("RGB")
            except Exception as e:
                raise ValueError(
                    "Failed to open file. Ensure the URL points to an image or PDF."
                ) from e
            mime_type = "image/png"

        result = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Part.from_bytes(data=response.content, mime_type=mime_type),
                "Extract all text from this certificate. Return only the extracted text, nothing else.",
            ],
        )

        return result.text.strip() or "No text extracted"


class FakeDetector:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "gemini-2.5-flash"

    def detect(self, image_url: str) -> FakeDetectionOutput:
        response = requests.get(image_url)
        response.raise_for_status()

        result = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Part.from_bytes(data=response.content, mime_type="image/png"),
                fake_detection_prompt.format(),
            ],
        )

        return fake_parser.parse(result.text)


def get_user_history(username: str) -> list:
    if username not in user_sessions:
        user_sessions[username] = [
            SystemMessage(
                content="You are a helpful assistant. Remember details about the user across the conversation."
            )
        ]
    return user_sessions[username]


def chat_with_user(username: str, message: str) -> str:
    history = get_user_history(username)

    # query RAG for relevant company context
    rag_context = query_rag(message)
    enriched_message = f"{message}\n\n[Company Context]: {rag_context}"

    history.append(HumanMessage(content=enriched_message))

    if len(history) > MAX_MESSAGES:
        history_text = "\n".join(
            [
                f"{'User' if isinstance(m, HumanMessage) else 'AI'}: {m.content}"
                for m in history[1:]
            ]
        )
        summary = llm.invoke(
            [
                SystemMessage(
                    content="Summarize this conversation briefly, keeping all key facts about the user."
                ),
                HumanMessage(content=history_text),
            ]
        )
        user_sessions[username] = [
            SystemMessage(
                content=f"You are a helpful assistant. Previous conversation summary: {summary.content}"
            )
        ]
        history = user_sessions[username]
        history.append(HumanMessage(content=enriched_message))

    response = llm.invoke(history)
    history.append(AIMessage(content=response.content))

    return response.content
