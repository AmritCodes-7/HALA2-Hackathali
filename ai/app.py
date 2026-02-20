# main.py
import os
import httpx
from fastapi import FastAPI
from pydantic import BaseModel, AnyHttpUrl
from typing import List
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from src.prompt import generate_certificate_prompt, parser, CertificateValidationOutput
from src.helper import TextExtractorModel

load_dotenv()

USER_INFO_API = os.getenv("USER_INFO_API")  # "http://localhost:8080/image/{image_id}"

app = FastAPI()


class User(BaseModel):
    id: int
    name: str
    skills: List[str]
    pdf_url: AnyHttpUrl


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)


@app.get("/validate-user/{image_id}")
async def validate_user(image_id: int):
    # Step 1: Build URL with actual image_id
    url = USER_INFO_API.format(image_id=image_id)

    # Step 2: Fetch user from Spring Boot API
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        user_data = response.json()

    # Step 3: Parse into Pydantic model
    user = User(**user_data)

    # Step 4: Extract text from certificate
    textExtractor = TextExtractorModel()
    certificate_text = textExtractor.extract_text_from_url(str(user.pdf_url))

    # Step 5: Generate prompt
    prompt = generate_certificate_prompt(
        user_id=user.id, user_skills=user.skills, certificate_text=certificate_text
    )

    # Step 6: Get LLM response
    raw_output = llm.invoke(prompt)

    # Step 7: Parse output
    validation_result: CertificateValidationOutput = parser.parse(raw_output.content)

    return validation_result.model_dump()
