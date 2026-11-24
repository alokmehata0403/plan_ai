from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TripPlanRequest(BaseModel):
    destination: str = Field(..., example="Tokyo")
    departure_city: str = Field("Los Angeles", example="Los Angeles")
    departure_date: Optional[str] = Field("2026-12-10", example="2026-12-10")
    duration_days: int = Field(5, ge=1, le=30, example=5)
    num_travelers: int = Field(2, ge=1, le=10, example=2)
    traveler_type: str = Field("couple", example="couple") # solo, couple, family, friends, budget, luxury
    budget: int = Field(3000, ge=100, example=3000)
    interests: List[str] = Field(default_factory=lambda: ["culture", "food"], example=["culture", "food"])
    trip_pace: str = Field("moderate", example="moderate") # relaxed, moderate, packed
    notes: Optional[str] = Field("", example="Prefer direct flights and boutique stays")

class ChatMessageRequest(BaseModel):
    message: str = Field(..., example="Can we add a day trip to Mt. Fuji?")
    thread_id: Optional[str] = None
    destination: Optional[str] = None
