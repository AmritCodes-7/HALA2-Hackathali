from typing import List
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser


# Certificate Validation
class CertificateValidationOutput(BaseModel):
    username: str
    result: bool


certificate_prompt_template = """
You are an intelligent certificate validator for real-world vocational and trade skills.

The certificate text may be from:
- Vocational training centers
- Trade schools
- Government skill development programs (e.g. CTEVT, Skill Nepal)
- Workshop completion certificates
- Apprenticeship certificates

The certificate text may also be:
- Poorly extracted due to OCR errors
- Have typos or misread characters
- Have words in wrong order or merged together
- Contain decorative/filler text — ignore these

Vocational skills to understand (not limited to):
- Trades: Plumber, Electrician, Carpenter, Mason, Welder
- Beauty: Barber, Hair Stylist, Beautician, Makeup Artist
- Textile: Tailor, Embroidery, Knitting, Weaving
- Repair: Mobile Repair, Computer Repair, Vehicle Mechanic
- Food: Cook, Baker, Catering, Food Processing
- Agriculture: Farming, Poultry, Horticulture
- Healthcare: Health Assistant, Pharmacy Assistant, Lab Technician

Instructions:
- Be flexible and intelligent — do NOT do exact word matching
- Understand synonyms and related terms:
  * "Cutting & Styling" implies Barber/Hair Stylist
  * "Plumbing works" implies Plumber
  * "Stitching & Tailoring" implies Tailor
  * "Electrical wiring" implies Electrician
- If a skill is partially mentioned, implied, or strongly related → mark as verified
- Only mark as not verified if there is absolutely no evidence or relation
- Ignore filler text like "Lorem ipsum", "Signature", "Name Surname"
- result must be true if ALL skills are verified, otherwise false

Username: {username}
Claimed Skills: {user_skills}
Certificate Text: {certificate_text}

Return ONLY a raw JSON object with no markdown, no code blocks, no explanation:
{{"username": "{username}", "result": true}}
"""

prompt_template = PromptTemplate(
    input_variables=["username", "user_skills", "certificate_text"],
    template=certificate_prompt_template,
)

parser = PydanticOutputParser(pydantic_object=CertificateValidationOutput)


def generate_certificate_prompt(
    username: str,
    user_skills: List[str],
    certificate_text: str,
) -> str:
    skills_str = ", ".join(user_skills) if user_skills else "No skills provided"
    return prompt_template.format(
        username=username, user_skills=skills_str, certificate_text=certificate_text
    )


# Fake Detection
class FakeDetectionOutput(BaseModel):
    authentic: bool
    reason: str


fake_detection_prompt_template = """
Analyze this certificate image and answer the following:
1. Does it look like a real official certificate?
2. Are there signs of tampering, editing, or forgery?
3. Is the text consistent and professionally formatted?

Be generous — if it looks like a genuine certificate from a vocational or training institute, mark it as authentic.
Only mark as not authentic if there are clear and obvious signs of forgery.

Return ONLY a raw JSON object with no markdown, no code blocks, no explanation:
{{"authentic": true, "reason": "explanation here"}}
"""

fake_detection_prompt = PromptTemplate(
    input_variables=[],
    template=fake_detection_prompt_template,
)

fake_parser = PydanticOutputParser(pydantic_object=FakeDetectionOutput)