from fastapi import APIRouter, Query
from tools.mock_data import (
    get_destinations,
    get_flights,
    get_hotels,
    get_activities,
    get_restaurants
)

router = APIRouter(prefix="/api", tags=["Destinations & Search"])

@router.get("/destinations")
def list_destinations():
    """Return featured destinations metadata with imagery & estimates"""
    return get_destinations()

@router.get("/flights")
def search_flights(destination: str = Query(...)):
    """Search flight options for destination"""
    return get_flights(destination)

@router.get("/hotels")
def search_hotels(destination: str = Query(...)):
    """Search accommodations for destination"""
    return get_hotels(destination)

@router.get("/activities")
def search_activities(destination: str = Query(...)):
    """Search activities and sights for destination"""
    return get_activities(destination)

@router.get("/restaurants")
def search_restaurants(destination: str = Query(...)):
    """Search restaurants and dining for destination"""
    return get_restaurants(destination)
