import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from keras.models import load_model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_headers=["Content-Type"]
)

model = load_model(filepath="model.keras")

class Item(BaseModel):
    year: int

@app.post("/api/predict")
def root(item: Item):
    year = item.year
    return {}

# uvicorn main:app --reload --port 8080
