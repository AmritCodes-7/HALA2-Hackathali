import os
import requests
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, TypeAdapter, ValidationError
from PIL import Image
from io import BytesIO
from google import genai
from google.genai import types
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from src.prompt import fake_detection_prompt, fake_parser, FakeDetectionOutput

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
)

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


def get_user_agent(username: str):
    if username not in user_sessions:
        user_sessions[username] = create_agent(
            model=llm,
            tools=[],
            middleware=[
                SummarizationMiddleware(
                    model=llm,
                    trigger=[("tokens", 10000), ("messages", 20)],
                    keep=("messages", 6),
                    summary_prefix="[SUMMARY] ",
                )
            ],
        )
    return user_sessions[username]


def chat_with_user(username: str, message: str) -> str:
    agent = get_user_agent(username)
    response = agent.invoke({"messages": [HumanMessage(content=message)]})
    return response["messages"][-1].content
