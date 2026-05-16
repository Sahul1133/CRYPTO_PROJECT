from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Crypto AI Predictor Backend Running"}
