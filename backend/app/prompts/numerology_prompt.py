from app.schemas.report import ReportRequest


def build_numerology_prompt(request: ReportRequest, numbers: dict) -> str:
    name = " ".join(p for p in [request.first_name, request.middle_name, request.last_name] if p)
    question_section = (
        f"\nTheir specific question: {request.question}"
        if request.question
        else ""
    )

    return f"""You are an expert numerologist with 30 years of experience in Pythagorean numerology.

PERSON PROFILE:
- Full Name: {name}
- Date of Birth: {request.dob}
- Gender: {request.gender}
- Country: {request.country}
{question_section}

CALCULATED NUMEROLOGY PROFILE (DO NOT RECALCULATE — interpret only):
- Life Path Number: {numbers['life_path']} ({numbers['meanings']['life_path']})
- Destiny Number: {numbers['destiny']} ({numbers['meanings']['destiny']})
- Soul Urge Number: {numbers['soul_urge']} ({numbers['meanings']['soul_urge']})
- Personality Number: {numbers['personality']} ({numbers['meanings']['personality']})
- Birthday Number: {numbers['birthday']}
- Personal Year Number: {numbers['personal_year']} (current year energy)
- Expression Number: {numbers['expression']}
- Lucky Numbers: {', '.join(str(n) for n in numbers['lucky_numbers'])}
- Lucky Colors: {', '.join(numbers['lucky_colors'])}
- Lucky Days: {', '.join(numbers['lucky_days'])}

INSTRUCTIONS:
Provide a detailed, warm, and empowering numerology reading. Structure your response with these exact sections using these headers:

## ✨ Core Personality
## 💼 Career & Professional Path
## 💕 Relationships & Love Life
## 🌟 Strengths & Natural Gifts
## 🌱 Challenges & Growth Areas
## 🌀 Current Year Energy ({numbers['personal_year']} Personal Year)
## 🔮 Spiritual Advice & Guidance

RULES:
- Base ALL insights strictly on the numbers provided above.
- Write in warm, positive, professional, empowering language.
- Be specific and reference the actual numbers in your reading.
- Do NOT guarantee specific future outcomes.
- Minimum 700 words. Be thorough and insightful.
- Each section should be at least 2-3 paragraphs.
"""
