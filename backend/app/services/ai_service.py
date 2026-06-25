import httpx
import asyncio
from app.core.config import settings


class GroqAIService:
    def __init__(self):
        self.base_url = settings.groq_base_url
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def get_interpretation(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an expert numerologist. Provide detailed, "
                        "warm, and empowering readings based strictly on "
                        "calculated numerology values."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 2048,
        }

        last_error: Exception | None = None
        for attempt in range(3):
            try:
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        json=payload,
                        headers=self.headers,
                    )
                    response.raise_for_status()
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
            except httpx.HTTPStatusError as e:
                last_error = e
                if e.response.status_code in (401, 403):
                    raise ValueError(
                        "Invalid Groq API key. Please check your .env file."
                    ) from e
                if attempt < 2:
                    await asyncio.sleep(2 ** attempt)
            except httpx.RequestError as e:
                last_error = e
                if attempt < 2:
                    await asyncio.sleep(2 ** attempt)

        raise RuntimeError(
            f"AI service failed after 3 attempts: {last_error}"
        ) from last_error


groq_service = GroqAIService()
