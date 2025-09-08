import prelude
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    year: int

@app.get("/api")
def root():
    return ""

@app.post("/api/predict")
def root(item: Item):
    year = item.year
    if year > 2150:
        return {"error": "Unprojectable year"}

    return prelude.predict(year)
