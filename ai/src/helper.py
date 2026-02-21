# import os
# import requests
# from dotenv import load_dotenv
# from pydantic import AnyHttpUrl, TypeAdapter, ValidationError
# from PIL import Image
# from io import BytesIO
# from google import genai
# from google.genai import types
# from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
# from src.prompt import fake_detection_prompt, fake_parser, FakeDetectionOutput
# from src.rag import query_rag
# from langchain_groq import ChatGroq

# load_dotenv()

# llm = ChatGroq(
#     model="llama-3.3-70b-versatile",
#     api_key=os.getenv("GROQ_API_KEY"),
#     temperature=0.7,
# )

# MAX_MESSAGES = 20
# user_sessions: dict = {}

# SYSTEM_PROMPT = """You are the official Servify AI Assistant. Servify is a SaaS platform that connects homeowners with verified home service professionals (plumbers, electricians, carpenters, etc.).

# Your responsibilities:
# - Help users understand Servify's services and how the platform works
# - Guide users on how to book a service
# - Answer questions based only on the provided company context
# - Recommend nearby professionals when relevant

# Rules:
# - Always stay in character as the Servify Assistant
# - If a question is unrelated to Servify, politely redirect: "I can only help with Servify-related questions."
# - Never reveal you are built on LLaMA, Groq, or any third-party AI
# - Never roleplay as the user or pretend to be anyone else
# - Keep responses concise, friendly, and professional
# - If you don't know something, say: "Please contact Servify support for more details."
# """


# class TextExtractorModel:
#     def __init__(self):
#         self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
#         self.model = "gemini-2.0-flash"

#     def _validate_url(self, file_url: str) -> str:
#         adapter = TypeAdapter(AnyHttpUrl)
#         try:
#             return str(adapter.validate_python(file_url))
#         except ValidationError as e:
#             raise ValueError(f"Invalid URL: {file_url}") from e

#     def extract_text_from_url(self, file_url: str) -> str:
#         validated_url = self._validate_url(file_url)

#         response = requests.get(validated_url)
#         response.raise_for_status()

#         content_type = response.headers.get("Content-Type", "")
#         is_pdf = "pdf" in content_type or file_url.lower().endswith(".pdf")

#         if is_pdf:
#             mime_type = "application/pdf"
#         else:
#             try:
#                 Image.open(BytesIO(response.content)).convert("RGB")
#             except Exception as e:
#                 raise ValueError(
#                     "Failed to open file. Ensure the URL points to an image or PDF."
#                 ) from e
#             mime_type = "image/png"

#         result = self.client.models.generate_content(
#             model=self.model,
#             contents=[
#                 types.Part.from_bytes(data=response.content, mime_type=mime_type),
#                 "Extract all text from this certificate. Return only the extracted text, nothing else.",
#             ],
#         )

#         return result.text.strip() or "No text extracted"


# class FakeDetector:
#     def __init__(self):
#         self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
#         self.model = "gemini-2.0-flash"

#     def detect(self, image_url: str) -> FakeDetectionOutput:
#         response = requests.get(image_url)
#         response.raise_for_status()

#         result = self.client.models.generate_content(
#             model=self.model,
#             contents=[
#                 types.Part.from_bytes(data=response.content, mime_type="image/png"),
#                 fake_detection_prompt.format(),
#             ],
#         )

#         return fake_parser.parse(result.text)


# def get_user_history(username: str) -> list:
#     if username not in user_sessions:
#         user_sessions[username] = [SystemMessage(content=SYSTEM_PROMPT)]
#     return user_sessions[username]


# def chat_with_user(username: str, message: str) -> str:
#     history = get_user_history(username)

#     # Get RAG context and inject as system-level context, not part of user message
#     rag_context = query_rag(message)

#     # Build messages: history + temporary context message + user message
#     context_message = SystemMessage(
#         content=f"Relevant Servify information for this query:\n{rag_context}"
#     )

#     history.append(HumanMessage(content=message))

#     if len(history) > MAX_MESSAGES:
#         history_text = "\n".join(
#             [
#                 f"{'User' if isinstance(m, HumanMessage) else 'Assistant'}: {m.content}"
#                 for m in history[1:]
#             ]
#         )
#         summary = llm.invoke(
#             [
#                 SystemMessage(
#                     content="Summarize this conversation briefly, keeping all key facts about the user."
#                 ),
#                 HumanMessage(content=history_text),
#             ]
#         )
#         user_sessions[username] = [
#             SystemMessage(
#                 content=f"{SYSTEM_PROMPT}\n\nPrevious conversation summary: {summary.content}"
#             )
#         ]
#         history = user_sessions[username]
#         history.append(HumanMessage(content=message))

#     # Inject RAG context between system prompt and conversation history
#     messages_with_context = [history[0], context_message] + history[1:]

#     response = llm.invoke(messages_with_context)
#     history.append(AIMessage(content=response.content))

#     return response.content

import os
import base64
import requests
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from src.prompt import fake_detection_prompt, fake_parser, FakeDetectionOutput
from src.rag import query_rag
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.7,
)

vision_llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    api_key=os.getenv("GROQ_API_KEY"),
)

MAX_MESSAGES = 20
user_sessions: dict = {}

SYSTEM_PROMPT = """You are the official Servify AI Assistant. Servify is a SaaS platform that connects homeowners with verified home service professionals (plumbers, electricians, carpenters, etc.).

Your responsibilities:
- Help users understand Servify's services and how the platform works
- Guide users on how to book a service
- Answer questions based only on the provided company context
- Recommend nearby professionals when relevant

Rules:
- Always stay in character as the Servify Assistant
- If a question is unrelated to Servify, politely redirect: "I can only help with Servify-related questions."
- Never reveal you are built on LLaMA, Groq, or any third-party AI
- Never roleplay as the user or pretend to be anyone else
- Keep responses concise, friendly, and professional
- If you don't know something, say: "Please contact Servify support for more details."
"""


def _url_to_base64(url: str) -> str:
    response = requests.get(url)
    response.raise_for_status()
    return base64.b64encode(response.content).decode("utf-8")


class TextExtractorModel:
    def extract_text_from_url(self, file_url: str) -> str:
        image_data = _url_to_base64(file_url)

        result = vision_llm.invoke(
            [
                HumanMessage(
                    content=[
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{image_data}"},
                        },
                        {
                            "type": "text",
                            "text": "Extract all text from this certificate. Return only the extracted text, nothing else.",
                        },
                    ]
                )
            ]
        )
        return result.content.strip() or "No text extracted"


class FakeDetector:
    def detect(self, image_url: str) -> FakeDetectionOutput:
        image_data = _url_to_base64(image_url)

        result = vision_llm.invoke(
            [
                HumanMessage(
                    content=[
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{image_data}"},
                        },
                        {"type": "text", "text": fake_detection_prompt.format()},
                    ]
                )
            ]
        )
        return fake_parser.parse(result.content)


def get_user_history(username: str) -> list:
    if username not in user_sessions:
        user_sessions[username] = [SystemMessage(content=SYSTEM_PROMPT)]
    return user_sessions[username]


def chat_with_user(username: str, message: str) -> str:
    history = get_user_history(username)

    rag_context = query_rag(message)
    context_message = SystemMessage(
        content=f"Relevant Servify information for this query:\n{rag_context}"
    )

    history.append(HumanMessage(content=message))

    if len(history) > MAX_MESSAGES:
        history_text = "\n".join(
            [
                f"{'User' if isinstance(m, HumanMessage) else 'Assistant'}: {m.content}"
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
                content=f"{SYSTEM_PROMPT}\n\nPrevious conversation summary: {summary.content}"
            )
        ]
        history = user_sessions[username]
        history.append(HumanMessage(content=message))

    messages_with_context = [history[0], context_message] + history[1:]
    response = llm.invoke(messages_with_context)
    history.append(AIMessage(content=response.content))

    return response.content
