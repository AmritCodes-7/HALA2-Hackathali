import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from src.prompt import generate_certificate_prompt, parser, CertificateValidationOutput
from src.helper import TextExtractorModel, chat_with_user, FakeDetector
from src.rag import create_index, ingest_documents

load_dotenv()

app = FastAPI()


class UserMessage(BaseModel):
    username: str
    skills: List[str]
    certificateUrl: str


class ChatRequest(BaseModel):
    username: str
    message: str


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

create_index()
ingest_documents("src/data/servify_rag.txt")


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else raw
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()


@app.post("/validate-user")
async def validate_user(data: UserMessage):
    fake_detector = FakeDetector()
    authenticity = fake_detector.detect(data.certificateUrl)

    if not authenticity.authentic:
        return {
            "username": data.username,
            "result": False,
            "reason": f"Certificate appears fake: {authenticity.reason}",
        }

    user_skills = list(data.skills)

    textExtractor = TextExtractorModel()
    certificate_text = textExtractor.extract_text_from_url(data.certificateUrl)

    prompt = generate_certificate_prompt(
        username=data.username,
        user_skills=user_skills,
        certificate_text=certificate_text,
    )

    raw_output = llm.invoke(prompt)
    validation_result: CertificateValidationOutput = parser.parse(
        _clean_json(raw_output.content)
    )

    return validation_result.model_dump()


@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    response = chat_with_user(request.username, request.message)
    return {
        "username": request.username,
        "message": request.message,
        "response": response,
    }
