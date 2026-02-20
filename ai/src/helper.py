import os
import requests
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, TypeAdapter, ValidationError
from PIL import Image
from io import BytesIO
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


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
        # Step 1: Validate URL
        validated_url = self._validate_url(file_url)

        # Step 2: Fetch image
        response = requests.get(validated_url)
        response.raise_for_status()

        # Step 3: Validate image
        try:
            image = Image.open(BytesIO(response.content)).convert("RGB")
        except Exception as e:
            raise ValueError(
                "Failed to open image. Ensure the URL points to an image file."
            ) from e

        # Step 4: Call Gemini
        result = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Part.from_bytes(data=response.content, mime_type="image/png"),
                "Extract all text from this certificate image. Return only the extracted text, nothing else.",
            ],
        )

        return result.text.strip() or "No text extracted"
