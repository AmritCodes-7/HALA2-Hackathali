import os
import httpx
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from src.prompt import generate_certificate_prompt, parser, CertificateValidationOutput
from src.helper import TextExtractorModel, chat_with_user, FakeDetector
from src.rag import create_index, ingest_documents

load_dotenv()

USER_INFO_API = "http://localhost:8081/api/py/{username}"

app = FastAPI()


class Skill(BaseModel):
    skill: str | None = None
    level: int | None = None


class UserMessage(BaseModel):
    username: str
    skills: List[Skill]
    certificateUrl: str


class SpringBootResponse(BaseModel):
    success: bool
    message: UserMessage


class ChatRequest(BaseModel):
    username: str
    message: str


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

create_index()
ingest_documents("../ai/data/servify_rag.txt")


@app.get("/validate-user/{username}")
async def validate_user(username: str):
    url = USER_INFO_API.format(username=username)

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = SpringBootResponse(**response.json())

    fake_detector = FakeDetector()
    authenticity = fake_detector.detect(data.message.certificateUrl)

    if not authenticity.authentic:
        return {
            "username": username,
            "summary": "Not Verified",
            "reason": f"Certificate appears fake: {authenticity.reason}",
        }

    user_skills = [
        (
            f"{skill.skill} (level {skill.level})"
            if skill.skill
            else f"Level {skill.level}"
        )
        for skill in data.message.skills
    ]

    textExtractor = TextExtractorModel()
    certificate_text = textExtractor.extract_text_from_url(data.message.certificateUrl)

    prompt = generate_certificate_prompt(
        username=data.message.username,
        user_skills=user_skills,
        certificate_text=certificate_text,
    )

    raw_output = llm.invoke(prompt)
    validation_result: CertificateValidationOutput = parser.parse(raw_output.content)

    return validation_result.model_dump()


@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    response = chat_with_user(request.username, request.message)
    return {
        "username": request.username,
        "message": request.message,
        "response": response,
    }
