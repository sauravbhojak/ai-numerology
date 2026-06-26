import re
import html
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)

# Dark Cosmic Theme Color Palette
COSMIC_BLACK = HexColor("#0A0915")
COSMIC_DEEP = HexColor("#121024")
COSMIC_PURPLE = HexColor("#1f153a")
GOLD = HexColor("#D4AF37")
GOLD_LIGHT = HexColor("#F0D060")
SILVER = HexColor("#D1D1D6")
SILVER_MUTED = HexColor("#8E8E93")
WHITE = HexColor("#FFFFFF")


def _styles() -> dict:
    return {
        "title": ParagraphStyle(
            "Title",
            fontSize=30,
            textColor=GOLD,
            alignment=TA_CENTER,
            spaceAfter=6,
            fontName="Helvetica-Bold",
            leading=36,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            fontSize=11.5,
            textColor=SILVER,
            alignment=TA_CENTER,
            spaceAfter=8,
            fontName="Helvetica",
            leading=16,
        ),
        "section_header": ParagraphStyle(
            "SectionHeader",
            fontSize=15,
            textColor=GOLD,
            spaceAfter=8,
            spaceBefore=18,
            fontName="Helvetica-Bold",
            leading=20,
        ),
        "sub_header": ParagraphStyle(
            "SubHeader",
            fontSize=12,
            textColor=GOLD_LIGHT,
            spaceAfter=6,
            spaceBefore=12,
            fontName="Helvetica-Bold",
            leading=16,
        ),
        "body": ParagraphStyle(
            "Body",
            fontSize=10,
            textColor=SILVER,
            spaceAfter=8,
            fontName="Helvetica",
            leading=15,
        ),
        "bullet_body": ParagraphStyle(
            "BulletBody",
            fontSize=10,
            textColor=SILVER,
            spaceAfter=6,
            leftIndent=15,
            fontName="Helvetica",
            leading=15,
        ),
        "number_label": ParagraphStyle(
            "NumberLabel",
            fontSize=8.5,
            textColor=SILVER_MUTED,
            alignment=TA_CENTER,
            fontName="Helvetica",
            leading=11,
        ),
        "number_value": ParagraphStyle(
            "NumberValue",
            fontSize=22,
            textColor=GOLD,
            alignment=TA_CENTER,
            fontName="Helvetica-Bold",
            leading=26,
        ),
    }


def _draw_background(canvas, doc):
    canvas.saveState()
    w, h = A4

    # 1. Solid cosmic black background across entire page
    canvas.setFillColor(COSMIC_BLACK)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # 2. Top decorative cosmic purple header bar
    canvas.setFillColor(COSMIC_DEEP)
    canvas.rect(0, h - 2.4 * cm, w, 2.4 * cm, fill=1, stroke=0)

    # Gold accent line below top bar
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.5)
    canvas.line(0, h - 2.4 * cm, w, h - 2.4 * cm)

    # Header text
    canvas.setFont("Helvetica-Bold", 9)
    canvas.setFillColor(GOLD)
    if doc.page == 1:
        header_str = "✦  AI NUMEROLOGY • SACRED COSMIC BLUEPRINT  ✦"
    else:
        header_str = "✦  AI NUMEROLOGY • CONTINUED READING  ✦"
    canvas.drawCentredString(w / 2, h - 1.4 * cm, header_str)

    # 3. Bottom footer bar
    canvas.setStrokeColor(COSMIC_PURPLE)
    canvas.setLineWidth(0.75)
    canvas.line(1.5 * cm, 1.6 * cm, w - 1.5 * cm, 1.6 * cm)

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(SILVER_MUTED)
    canvas.drawString(
        1.5 * cm,
        0.9 * cm,
        f"Confidential AI Reading  •  Generated on {datetime.now().strftime('%B %d, %Y')}",
    )
    canvas.drawRightString(w - 1.5 * cm, 0.9 * cm, f"Page {doc.page}")

    canvas.restoreState()


def _number_table(numbers: dict, styles: dict) -> Table:
    """Create a 4-column grid of core numbers."""
    fields = [
        ("Life Path", numbers["life_path"]),
        ("Destiny", numbers["destiny"]),
        ("Soul Urge", numbers["soul_urge"]),
        ("Personality", numbers["personality"]),
        ("Birthday", numbers["birthday"]),
        ("Personal Year", numbers["personal_year"]),
        ("Expression", numbers["expression"]),
        ("Lucky Sum", numbers["lucky_numbers"][0] if numbers["lucky_numbers"] else "-"),
    ]

    cells = []
    row = []
    for i, (label, value) in enumerate(fields):
        cell = [
            Paragraph(str(value), styles["number_value"]),
            Paragraph(label, styles["number_label"]),
        ]
        row.append(cell)
        if (i + 1) % 4 == 0:
            cells.append(row)
            row = []
    if row:
        while len(row) < 4:
            row.append([""])
        cells.append(row)

    table = Table(cells, colWidths=[4.5 * cm] * 4, rowHeights=[2.6 * cm] * len(cells))
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), COSMIC_DEEP),
            ("GRID", (0, 0), (-1, -1), 0.75, COSMIC_PURPLE),
            ("BOX", (0, 0), (-1, -1), 1, GOLD),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("ROUNDEDCORNERS", [6]),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ])
    )
    return table


def _lucky_table(numbers: dict, styles: dict) -> Table:
    header = [
        Paragraph("Lucky Numbers", styles["section_header"]),
        Paragraph("Lucky Colors", styles["section_header"]),
        Paragraph("Lucky Days", styles["section_header"]),
    ]
    values = [
        Paragraph(", ".join(str(n) for n in numbers["lucky_numbers"]), styles["body"]),
        Paragraph(", ".join(numbers["lucky_colors"]), styles["body"]),
        Paragraph(", ".join(numbers["lucky_days"]), styles["body"]),
    ]
    table = Table([header, values], colWidths=[6 * cm] * 3)
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), COSMIC_PURPLE),
            ("BACKGROUND", (0, 1), (-1, 1), COSMIC_DEEP),
            ("BOX", (0, 0), (-1, -1), 1, GOLD),
            ("GRID", (0, 0), (-1, -1), 0.5, COSMIC_PURPLE),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ])
    )
    return table


def _format_markdown_inline(text: str) -> str:
    # Safely escape HTML/XML characters first
    clean = html.escape(text)
    # Convert **bold** to ReportLab bold gold tag
    clean = re.sub(r"\*\*(.*?)\*\*", r'<b><font color="#D4AF37">\1</font></b>', clean)
    clean = re.sub(r"__(.*?)__", r'<b><font color="#D4AF37">\1</font></b>', clean)
    clean = re.sub(r"\*(.*?)\*", r"<i>\1</i>", clean)
    return clean


def _parse_ai_sections(ai_text: str, styles: dict) -> list:
    """Convert AI markdown response to luxury ReportLab flowable elements."""
    elements = []
    for line in ai_text.split("\n"):
        line = line.strip()
        if not line:
            elements.append(Spacer(1, 6))
            continue

        if line.startswith("## ") or line.startswith("# "):
            raw_title = re.sub(r"^#{1,3}\s*", "", line).strip()
            # Clean emojis that aren't supported by standard PDF fonts
            clean_title = re.sub(r"[✨💼💕🌟🌱🌀🔮✦★☆💫🔢🎨📅]", "", raw_title).strip()
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(f"✦   {clean_title.upper()}", styles["section_header"]))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=GOLD, spaceAfter=8))
            continue

        if line.startswith("### ") or line.startswith("#### "):
            raw_sub = re.sub(r"^#{3,4}\s*", "", line).strip()
            clean_sub = html.escape(raw_sub)
            elements.append(Paragraph(f'<font color="#D4AF37">✦</font>  {clean_sub}', styles["sub_header"]))
            continue

        if line.startswith("- ") or line.startsWith("* ") or re.match(r"^\d+\.\s", line):
            bullet_content = re.sub(r"^(-\s|\*\s|\d+\.\s)", "", line).strip()
            formatted = _format_markdown_inline(bullet_content)
            elements.append(Paragraph(f'<font color="#D4AF37">✦</font>   {formatted}', styles["bullet_body"]))
            continue

        formatted_line = _format_markdown_inline(line)
        elements.append(Paragraph(formatted_line, styles["body"]))

    return elements


def generate_pdf(report_data: dict) -> bytes:
    """
    Generate a premium luxury PDF from the report data dict.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=3.2 * cm,
        bottomMargin=2.4 * cm,
    )

    styles = _styles()
    story = []

    # ── Header ──────────────────────────────────────────────
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph("Decode Your Destiny", styles["title"]))
    story.append(Paragraph("Sacred Numerological Blueprint & Astrological Synthesis", styles["subtitle"]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14))

    # ── Personal Info Card ───────────────────────────────────
    full_name = html.escape(report_data.get("full_name", ""))
    dob = html.escape(report_data.get("dob", ""))
    gender = html.escape(report_data.get("gender", "")).title()
    country = html.escape(report_data.get("country", ""))
    gen_at = html.escape(report_data.get("generated_at", ""))

    info_data = [
        [
            Paragraph(f'<b><font color="#D4AF37">Name:</font></b>  <font color="#FFFFFF">{full_name}</font>', styles["body"]),
            Paragraph(f'<b><font color="#D4AF37">DOB:</font></b>  <font color="#FFFFFF">{dob}</font>', styles["body"]),
        ],
        [
            Paragraph(f'<b><font color="#D4AF37">Gender:</font></b>  <font color="#FFFFFF">{gender}</font>', styles["body"]),
            Paragraph(f'<b><font color="#D4AF37">Location:</font></b>  <font color="#FFFFFF">{country}</font>', styles["body"]),
        ],
        [
            Paragraph(f'<b><font color="#D4AF37">Generated:</font></b>  {gen_at}', styles["body"]),
            Paragraph('<b><font color="#D4AF37">Status:</font></b>  Confidential Reading', styles["body"]),
        ],
    ]
    info_table = Table(info_data, colWidths=[9 * cm, 9 * cm])
    info_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), COSMIC_DEEP),
            ("BOX", (0, 0), (-1, -1), 1, GOLD),
            ("GRID", (0, 0), (-1, -1), 0.5, COSMIC_PURPLE),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ])
    )
    story.append(info_table)
    story.append(Spacer(1, 0.6 * cm))

    # ── Core Numbers ─────────────────────────────────────────
    story.append(Paragraph("◈ Core Numerology Profile", styles["section_header"]))
    story.append(_number_table(report_data["numbers"], styles))
    story.append(Spacer(1, 0.6 * cm))

    # ── Number Meanings ──────────────────────────────────────
    story.append(Paragraph("◈ Core Vibrational Meanings", styles["section_header"]))
    for key, meaning in report_data["numbers"]["meanings"].items():
        label = key.replace("_", " ").title()
        value = report_data["numbers"].get(key, "")
        clean_meaning = html.escape(str(meaning))
        story.append(
            Paragraph(
                f'<b><font color="#F0D060">{label} ({value}):</font></b>  <font color="#D1D1D6">{clean_meaning}</font>',
                styles["body"],
            )
        )
    story.append(Spacer(1, 0.6 * cm))

    # ── Lucky Section ────────────────────────────────────────
    story.append(Paragraph("◈ Fortunate Attributes", styles["section_header"]))
    story.append(_lucky_table(report_data["numbers"], styles))
    story.append(Spacer(1, 0.6 * cm))

    # ── AI Interpretation ────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceBefore=8, spaceAfter=8))
    story.append(Paragraph("◈ AI Mystical Synthesis & Guidance", styles["section_header"]))
    story.extend(_parse_ai_sections(report_data.get("ai_response", ""), styles))

    # Attach page callbacks directly to build so ReportLab executes them
    doc.build(story, onFirstPage=_draw_background, onLaterPages=_draw_background)
    return buffer.getvalue()

