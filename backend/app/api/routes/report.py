from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
from io import BytesIO

from app.schemas.report import ReportRequest, ReportResponse, NumerologyNumbers
from app.services.numerology import calculate_all
from app.services.ai_service import groq_service
from app.prompts.numerology_prompt import build_numerology_prompt
from app.pdf.report_builder import generate_pdf

router = APIRouter(tags=["Reports"])


@router.post("/generate-report", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    """Calculate numerology numbers, call AI, and return the full report."""
    # 1. Calculate all numerology values
    numbers = calculate_all(
        first_name=request.first_name,
        middle_name=request.middle_name,
        last_name=request.last_name,
        dob=request.dob,
    )

    # 2. Build AI prompt and get interpretation
    prompt = build_numerology_prompt(request, numbers)
    try:
        ai_response = await groq_service.get_interpretation(prompt)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # 3. Assemble and return response
    name_parts = [request.first_name, request.middle_name, request.last_name]
    full_name = " ".join(p for p in name_parts if p)

    return ReportResponse(
        full_name=full_name,
        dob=str(request.dob),
        gender=request.gender,
        country=request.country,
        question=request.question,
        numbers=NumerologyNumbers(**numbers),
        ai_response=ai_response,
        generated_at=datetime.now().strftime("%B %d, %Y at %I:%M %p"),
    )


@router.post("/download-pdf")
async def download_pdf(request: dict):
    """Accept full report data and return a beautifully styled PDF."""
    try:
        pdf_bytes = generate_pdf(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    name = request.get("full_name", "numerology").replace(" ", "_")
    filename = f"numerology_report_{name}.pdf"

    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}
