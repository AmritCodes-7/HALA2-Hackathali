from typing import List
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser


# -------------------------
# Certificate Validation
# -------------------------
class SkillVerification(BaseModel):
    skill: str
    status: str
    reason: str | None = None


class CertificateValidationOutput(BaseModel):
    username: str
    skills_verification: List[SkillVerification]
    summary: str  # "Verified" or "Not Verified"


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
- Skills are provided as "skill name (level X)" or just "Level X" — verify based on skill name
- If a skill is partially mentioned, implied, or strongly related → mark "Verified"
- Only mark "Not Verified" if there is absolutely no evidence or relation
- Ignore filler text like "Lorem ipsum", "Signature", "Name Surname"
- Summary must be "Verified" if ALL skills are verified, otherwise "Not Verified"

Username: {username}
Claimed Skills: {user_skills}
Certificate Text: {certificate_text}

Return your output as JSON:
{{
  "username": "{username}",
  "skills_verification": [
    {{"skill": "Barber (level 5)", "status": "Verified", "reason": "Certificate mentions hair cutting and styling training"}},
    {{"skill": "Plumber (level 3)", "status": "Not Verified", "reason": "No mention of plumbing or related work found"}}
  ],
  "summary": "Verified" or "Not Verified"
}}

Important:
- Think like a human recruiter, not a keyword matcher
- Understand the context and intent of the certificate
- A barber certificate may say 'Beauty and Hair Care' — that still counts
- Be generous with related and implied skills
- summary = "Verified" only if ALL skills are verified, otherwise "Not Verified"
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

Return your output as JSON:
{{
  "authentic": true or false,
  "reason": "explanation here"
}}
"""

fake_detection_prompt = PromptTemplate(
    input_variables=[],
    template=fake_detection_prompt_template,
)

fake_parser = PydanticOutputParser(pydantic_object=FakeDetectionOutput)
