import sys
from pathlib import Path

# Add backend directory to sys.path so app imports work seamlessly in Vercel Serverless
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

for d in [str(BACKEND_DIR), str(ROOT_DIR)]:
    if d not in sys.path:
        sys.path.insert(0, d)

from app.main import app
