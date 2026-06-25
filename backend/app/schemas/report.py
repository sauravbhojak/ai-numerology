from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class ReportRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    middle_name: Optional[str] = Field(None, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    dob: date
    gender: str = Field(..., pattern="^(male|female|other|prefer_not_to_say)$")
    country: str = Field(..., min_length=2, max_length=100)
    question: Optional[str] = Field(None, max_length=500)


class NumerologyNumbers(BaseModel):
    life_path: int
    destiny: int
    soul_urge: int
    personality: int
    birthday: int
    personal_year: int
    expression: int
    lucky_numbers: List[int]
    lucky_colors: List[str]
    lucky_days: List[str]
    lucky_categories: dict = {}
    meanings: dict


class ReportResponse(BaseModel):
    full_name: str
    dob: str
    gender: str
    country: str
    question: Optional[str]
    numbers: NumerologyNumbers
    ai_response: str
    generated_at: str


class NameTunerRequest(BaseModel):
    original_name: str = Field(..., min_length=1, max_length=100)
    dob: date
    target_type: str = Field(..., pattern="^(company|instagram|youtube|card_name|other)$")


class NameTunerResponse(BaseModel):
    original_name: str
    target_type: str
    lucky_numbers: List[int]
    variations: List[str]
