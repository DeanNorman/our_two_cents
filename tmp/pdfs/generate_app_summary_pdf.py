from reportlab.lib.pagesizes import LETTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas


OUTPUT_PATH = "output/pdf/our_two_cents_app_summary.pdf"


def draw_wrapped_text(c, text, x, y, max_width, font_name="Helvetica", font_size=10, leading=13):
    c.setFont(font_name, font_size)
    words = text.split()
    line = ""
    for word in words:
        test_line = f"{line} {word}".strip()
        if pdfmetrics.stringWidth(test_line, font_name, font_size) <= max_width:
            line = test_line
        else:
            c.drawString(x, y, line)
            y -= leading
            line = word
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_section_title(c, title, x, y):
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x, y, title)
    return y - 14


def draw_bullets(c, bullets, x, y, max_width, font_size=9.5, leading=12):
    for bullet in bullets:
        bullet_text = f"- {bullet}"
        y = draw_wrapped_text(
            c,
            bullet_text,
            x,
            y,
            max_width=max_width,
            font_name="Helvetica",
            font_size=font_size,
            leading=leading,
        )
        y -= 2
    return y


def main():
    width, height = LETTER
    margin_x = 42
    y = height - 42
    content_width = width - (2 * margin_x)

    c = canvas.Canvas(OUTPUT_PATH, pagesize=LETTER)
    c.setTitle("Our Two Cents - App Summary")

    c.setFont("Helvetica-Bold", 16)
    c.drawString(margin_x, y, "Our Two Cents - App Summary")
    y -= 20

    c.setFont("Helvetica", 8)
    c.drawString(
        margin_x,
        y,
        "Evidence source: repository files in backend/, dashboard/, docs/, and top-level README.",
    )
    y -= 18

    y = draw_section_title(c, "What It Is", margin_x, y)
    what_it_is = (
        "Our Two Cents is a WhatsApp-first budgeting app with a companion web dashboard. "
        "Users log spends by message, while the backend stores and calculates budget data in Google Sheets."
    )
    y = draw_wrapped_text(c, what_it_is, margin_x, y, content_width, font_size=10, leading=13)
    y -= 6

    y = draw_section_title(c, "Who It Is For", margin_x, y)
    who_for = (
        "Primary persona: couples tracking shared spending and saving toward a house deposit "
        "(explicitly stated in README and reflected in user/goal flows)."
    )
    y = draw_wrapped_text(c, who_for, margin_x, y, content_width, font_size=10, leading=13)
    y -= 6

    y = draw_section_title(c, "What It Does", margin_x, y)
    feature_bullets = [
        "Accepts WhatsApp commands to log spends and parse category, amount, and merchant.",
        "Sends bot replies for help, categories, goal progress, undo, and budget feedback.",
        "Stores data in Google Sheets tabs: Transactions, Monthly Budgets, Savings Goal, Categories.",
        "Calculates monthly totals, per-category status, warning levels, and days left in month.",
        "Exposes dashboard API endpoints for overview, categories, transactions, and goals.",
        "Provides a React dashboard with phase-gated views, category filtering, and quick WhatsApp actions.",
    ]
    y = draw_bullets(c, feature_bullets, margin_x, y, content_width, font_size=9.5, leading=12)
    y -= 4

    y = draw_section_title(c, "How It Works (Architecture, Repo-Backed)", margin_x, y)
    architecture_bullets = [
        "Core components: React + Vite dashboard (dashboard/src), Express API server (backend/server.js), "
        "Twilio messaging service, Google Sheets service.",
        "Data flow A: User -> WhatsApp -> Twilio webhook -> /webhook/whatsapp route -> parser/budget/sheets services "
        "-> Google Sheets -> Twilio reply.",
        "Data flow B: Dashboard UI -> axios client (dashboard/src/services/api.ts) -> /api/dashboard routes "
        "-> budget/sheets services -> Google Sheets -> JSON to UI.",
        "Configuration comes from .env files (ports, Twilio credentials, Google credentials, phase, dashboard token).",
        "Dashboard route authentication enforcement in server wiring: Not found in repo "
        "(auth middleware exists in backend/middleware/auth.js but is not applied in backend/server.js).",
    ]
    y = draw_bullets(c, architecture_bullets, margin_x, y, content_width, font_size=9, leading=11)
    y -= 4

    y = draw_section_title(c, "How To Run (Minimal)", margin_x, y)
    run_steps = [
        "Install deps: `cd backend && npm install`; then `cd ../dashboard && npm install`.",
        "Create env files: copy backend/.env.example and dashboard/.env.example, then set required values "
        "(Google Sheet + service account, Twilio credentials, phone numbers, dashboard token, API URL).",
        "Start apps: backend `npm run dev` (port 3000), dashboard `npm run dev` (Vite local URL).",
        "For WhatsApp end-to-end testing, run ngrok and set Twilio sandbox webhook to `/webhook/whatsapp`.",
        "Production backend/frontend URLs: Not found in repo.",
    ]
    y = draw_bullets(c, run_steps, margin_x, y, content_width, font_size=9.5, leading=12)

    if y < 30:
        raise RuntimeError(f"Content overflow: final y-position {y} is below safe margin.")

    c.save()


if __name__ == "__main__":
    main()
