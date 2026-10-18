from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

app = FastAPI(title="Crypto AI Market Intelligence API")

# Allow all origins so deployed frontend (Vercel, custom domains, local) can connect seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(router, prefix="/api")


@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Crypto AI Predictor Engine Running",
        "endpoints": ["/api/predictions", "/api/coins", "/api/predict/{symbol}", "/api/chart/{symbol}", "/api/news"]
    }
