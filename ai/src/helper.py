import os
import requests
from dotenv import load_dotenv
from pydantic import AnyHttpUrl, TypeAdapter, ValidationError
from PIL import Image
from io import BytesIO

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")


class TextExtractorModel:
    def __init__(self, model_name="microsoft/trocr-base-printed"):
        self.model_name = model_name
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model_name}"
        self.headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

    def extract_text_from_url(self, file_url: str) -> str:
        adapter = TypeAdapter(AnyHttpUrl)

        try:
            validated_url = str(adapter.validate_python(file_url))
        except ValidationError as e:
            raise ValueError(f"Invalid URL: {file_url}") from e

        response = requests.get(validated_url)
        response.raise_for_status()

        file_bytes = BytesIO(response.content)

        # Validate it's a real image and normalize it
        try:
            image = Image.open(file_bytes).convert("RGB")
        except Exception as e:
            raise ValueError(
                "Failed to open image. Ensure the URL points to an image file."
            ) from e

        # Re-encode image as PNG for API
        img_bytes = BytesIO()
        image.save(img_bytes, format="PNG")

        api_response = requests.post(
            self.api_url, headers=self.headers, data=img_bytes.getvalue()
        )
        api_response.raise_for_status()
        result = api_response.json()

        text = result[0].get("generated_text") if isinstance(result, list) else ""
        return text or "No text extracted"
