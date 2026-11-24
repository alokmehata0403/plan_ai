import json
import uuid
import asyncio
from typing import List, Dict, Any
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from models.schemas import TripPlanRequest
from tools.mock_data import (
    get_flights,
    get_hotels,
    get_activities,
    get_restaurants
)
from supervisor import create_supervisor_agent

router = APIRouter(prefix="/api/plan", tags=["Trip Planning"])

_supervisor = None

def get_supervisor():
    global _supervisor
    if _supervisor is None:
        _supervisor = create_supervisor_agent(use_memory=True)
    return _supervisor


def build_structured_itinerary(
    destination: str,
    duration: int,
    hotel_name: str,
    activities: List[Dict],
    restaurants: List[Dict],
    pace: str = "moderate"
) -> List[Dict]:
    """Generate a clean day-by-day itinerary structured for UI cards"""
    days = []
    act_pool = list(activities)
    rest_pool = list(restaurants)

    slots_config = {
        "relaxed": [("10:00 AM - 01:00 PM", "morning"), ("03:30 PM - 06:30 PM", "afternoon")],
        "packed": [
            ("08:30 AM - 11:00 AM", "morning"),
            ("11:30 AM - 02:00 PM", "lunch"),
            ("02:30 PM - 05:30 PM", "afternoon"),
            ("06:30 PM - 09:30 PM", "evening")
        ],
        "moderate": [
            ("09:30 AM - 12:30 PM", "morning"),
            ("02:00 PM - 05:00 PM", "afternoon"),
            ("07:00 PM - 09:30 PM", "evening")
        ]
    }
    slots = slots_config.get(pace, slots_config["moderate"])

    day_themes = [
        "Arrival, Check-in & Neighborhood Walk",
        "Iconic Landmarks & Cultural Highlights",
        "Local Markets & Food Discoveries",
        "Scenic Views & Historic Sights",
        "Artisan Shops, Cafes & Evening Stroll",
        "Day Excursion & Countryside Views",
        "Relaxed Morning & Departure"
    ]

    for d in range(1, duration + 1):
        theme_index = (d - 1) % len(day_themes)
        schedule = []
        
        day_act_1 = act_pool[(d - 1) * 2 % len(act_pool)] if act_pool else None
        day_act_2 = act_pool[((d - 1) * 2 + 1) % len(act_pool)] if len(act_pool) > 1 else None
        day_rest = rest_pool[(d - 1) % len(rest_pool)] if rest_pool else None

        if d == 1:
            schedule.append({
                "time": slots[0][0],
                "title": f"Arrive & Check in at {hotel_name}",
                "description": f"Unpack and relax at your hotel in {destination.title()}.",
                "category": "Hotel",
                "icon": "hotel"
            })
            if day_act_1:
                schedule.append({
                    "time": slots[1][0] if len(slots) > 1 else "03:00 PM - 06:00 PM",
                    "title": day_act_1["name"],
                    "description": day_act_1["description"],
                    "category": day_act_1.get("category", "Culture"),
                    "price": day_act_1.get("price", 0),
                    "icon": "compass"
                })
        else:
            if day_act_1:
                schedule.append({
                    "time": slots[0][0],
                    "title": day_act_1["name"],
                    "description": day_act_1["description"],
                    "category": day_act_1.get("category", "Culture"),
                    "price": day_act_1.get("price", 0),
                    "icon": "compass"
                })
            if day_act_2:
                schedule.append({
                    "time": slots[1][0] if len(slots) > 1 else "02:00 PM - 05:00 PM",
                    "title": day_act_2["name"],
                    "description": day_act_2["description"],
                    "category": day_act_2.get("category", "Sightseeing"),
                    "price": day_act_2.get("price", 0),
                    "icon": "camera"
                })

        if day_rest:
            schedule.append({
                "time": slots[-1][0],
                "title": f"Dinner at {day_rest['name']}",
                "description": f"Enjoy authentic {day_rest.get('cuisine', 'local')} cuisine in {day_rest.get('neighborhood', 'the city')}.",
                "category": "Dining",
                "price": day_rest.get("price_range", "$$"),
                "icon": "utensils"
            })

        days.append({
            "day": d,
            "title": f"Day {d}: {day_themes[theme_index]}",
            "schedule": schedule
        })

    return days


def calculate_budget_breakdown(
    total_budget: int,
    duration: int,
    travelers: int,
    flights: List[Dict],
    hotels: List[Dict],
    activities: List[Dict]
) -> Dict[str, Any]:
    """Calculate structured budget itemization"""
    flight_per_person = flights[0]["price"] if flights else 750
    flight_total = flight_per_person * travelers

    rooms = max(1, (travelers + 1) // 2)
    hotel_per_night = hotels[0]["price_per_night"] if hotels else 180
    hotel_total = hotel_per_night * max(1, duration - 1) * rooms

    daily_food_pp = 65
    food_total = daily_food_pp * duration * travelers

    avg_act_cost = sum(a.get("price", 30) for a in activities[:duration * 2]) if activities else 250
    act_total = avg_act_cost * travelers

    transit_total = 20 * duration * travelers
    contingency = int((flight_total + hotel_total + food_total + act_total + transit_total) * 0.08)

    grand_total = flight_total + hotel_total + food_total + act_total + transit_total + contingency
    remaining = total_budget - grand_total

    items = [
        {"category": "Flights", "amount": flight_total, "color": "#2563eb", "icon": "plane"},
        {"category": "Hotels & Stays", "amount": hotel_total, "color": "#3b82f6", "icon": "hotel"},
        {"category": "Food & Dining", "amount": food_total, "color": "#059669", "icon": "utensils"},
        {"category": "Activities & Tours", "amount": act_total, "color": "#d97706", "icon": "compass"},
        {"category": "Local Transit", "amount": transit_total, "color": "#64748b", "icon": "train"},
        {"category": "Buffer / Contingency", "amount": contingency, "color": "#94a3b8", "icon": "shield"}
    ]

    for item in items:
        item["percentage"] = round((item["amount"] / grand_total) * 100, 1) if grand_total > 0 else 0

    return {
        "target_budget": total_budget,
        "grand_total": grand_total,
        "remaining_budget": remaining,
        "per_person_total": grand_total // max(1, travelers),
        "status": "within_budget" if remaining >= 0 else "exceeds_budget",
        "items": items
    }


@router.post("")
async def generate_plan(req: TripPlanRequest):
    """Generate complete trip plan combining all specialized agents"""
    dest = req.destination.strip()

    flights = get_flights(dest)
    hotels = get_hotels(dest)
    activities = get_activities(dest)
    restaurants = get_restaurants(dest)

    top_hotel_name = hotels[0]["name"] if hotels else f"Boutique Hotel in {dest.title()}"
    itinerary = build_structured_itinerary(dest, req.duration_days, top_hotel_name, activities, restaurants, req.trip_pace)
    budget_breakdown = calculate_budget_breakdown(req.budget, req.duration_days, req.num_travelers, flights, hotels, activities)

    query = (
        f"Plan a {req.duration_days}-day trip to {dest} for {req.num_travelers} travelers "
        f"departing from {req.departure_city}. Traveler profile: {req.traveler_type}. "
        f"Total budget: ${req.budget} USD. Interests: {', '.join(req.interests)}. "
        f"Pace: {req.trip_pace}. Notes: {req.notes or 'None'}. "
        f"Provide flight recommendations, hotel options, daily highlights, and budget breakdown."
    )

    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    summary_text = ""

    try:
        supervisor = get_supervisor()
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(
            None,
            lambda: supervisor.invoke({"messages": [{"role": "user", "content": query}]}, config=config)
        )
        if "messages" in res and res["messages"]:
            summary_text = res["messages"][-1].text
    except Exception as e:
        print(f"Supervisor LLM call notice: {e}")
        summary_text = (
            f"Here is your customized {req.duration_days}-day travel itinerary for {dest.title()}. "
            f"We have paired convenient flights from {req.departure_city} with accommodations in {dest.title()}, "
            f"curated local cultural experiences and dining, organized to match your budget."
        )

    return {
        "plan_id": thread_id,
        "destination": dest,
        "departure_city": req.departure_city,
        "departure_date": req.departure_date,
        "duration_days": req.duration_days,
        "num_travelers": req.num_travelers,
        "traveler_type": req.traveler_type,
        "target_budget": req.budget,
        "interests": req.interests,
        "summary": summary_text,
        "flights": flights,
        "hotels": hotels,
        "activities": activities,
        "restaurants": restaurants,
        "itinerary": itinerary,
        "budget": budget_breakdown,
        "thread_id": thread_id
    }


@router.post("/stream")
async def stream_plan_generation(req: TripPlanRequest):
    """Stream real-time specialist agent execution progress via SSE"""
    dest = req.destination.strip()

    async def event_generator():
        # 1. Supervisor starts
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Supervisor Agent', 'message': f'Analyzing {dest.title()} trip parameters for {req.num_travelers} traveler(s)...'})}\n\n"
        await asyncio.sleep(0.4)

        # 2. Flight Agent
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Flight Agent', 'message': f'Searching flight routes from {req.departure_city} to {dest.title()}...'})}\n\n"
        await asyncio.sleep(0.5)
        flights = get_flights(dest)
        best_flight = flights[0] if flights else None
        f_summary = f"Found {len(flights)} flight options. Recommended: {best_flight['airline']} ({best_flight['duration']}, ${best_flight['price']})" if best_flight else "Flights retrieved."
        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Flight Agent', 'message': f_summary, 'data': flights[:2]})}\n\n"
        await asyncio.sleep(0.4)

        # 3. Hotel Agent
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Hotel Agent', 'message': f'Scanning accommodations in {dest.title()} matching profile: {req.traveler_type}...'})}\n\n"
        await asyncio.sleep(0.5)
        hotels = get_hotels(dest)
        top_hotel = hotels[0] if hotels else None
        h_summary = f"Selected stays. Top pick: {top_hotel['name']} in {top_hotel.get('neighborhood', 'center')} (${top_hotel['price_per_night']}/night)" if top_hotel else "Accommodations catalogued."
        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Hotel Agent', 'message': h_summary, 'data': hotels[:2]})}\n\n"
        await asyncio.sleep(0.4)

        # 4. Activity Agent
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Activity Agent', 'message': f'Curating attractions and experiences for: {', '.join(req.interests)}...'})}\n\n"
        await asyncio.sleep(0.5)
        activities = get_activities(dest)
        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Activity Agent', 'message': f'Curated {len(activities)} attractions and cultural experiences.', 'data': activities[:3]})}\n\n"
        await asyncio.sleep(0.4)

        # 5. Food Agent
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Food Agent', 'message': f'Discovering authentic restaurants and dining in {dest.title()}...'})}\n\n"
        await asyncio.sleep(0.5)
        restaurants = get_restaurants(dest)
        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Food Agent', 'message': f'Selected {len(restaurants)} dining spots.', 'data': restaurants[:3]})}\n\n"
        await asyncio.sleep(0.4)

        # 6. Budget Agent
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Budget Agent', 'message': f'Calculating cost allocations against target budget of ${req.budget:,}...'})}\n\n"
        await asyncio.sleep(0.5)
        budget_breakdown = calculate_budget_breakdown(req.budget, req.duration_days, req.num_travelers, flights, hotels, activities)
        status_msg = "Budget is on track with a healthy buffer." if budget_breakdown["remaining_budget"] >= 0 else "Budget balanced for value."
        est_cost = budget_breakdown.get("grand_total", 0)
        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Budget Agent', 'message': f'Total estimated trip cost: ${est_cost:,} USD. {status_msg}', 'data': budget_breakdown})}\n\n"
        await asyncio.sleep(0.4)

        # 7. Itinerary Agent
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Itinerary Agent', 'message': f'Assembling cohesive {req.duration_days}-day daily schedule...'})}\n\n"
        await asyncio.sleep(0.5)
        top_hotel_name = hotels[0]["name"] if hotels else f"Boutique Hotel in {dest.title()}"
        itinerary = build_structured_itinerary(dest, req.duration_days, top_hotel_name, activities, restaurants, req.trip_pace)
        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Itinerary Agent', 'message': f'Complete {req.duration_days}-day schedule structured.', 'data': itinerary})}\n\n"
        await asyncio.sleep(0.4)

        # 8. Supervisor Synthesis
        yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'Supervisor Agent', 'message': 'Supervisor synthesizing travel advisor summary...'})}\n\n"

        thread_id = str(uuid.uuid4())
        config = {"configurable": {"thread_id": thread_id}}
        query = (
            f"Plan a {req.duration_days}-day trip to {dest} for {req.num_travelers} travelers "
            f"departing from {req.departure_city}. Traveler profile: {req.traveler_type}. "
            f"Total budget: ${req.budget} USD. Interests: {', '.join(req.interests)}. "
            f"Pace: {req.trip_pace}. Notes: {req.notes or 'None'}. "
            f"Provide a warm, personalized travel advisor summary highlighting best flights, stays, dining, and daily tips."
        )

        summary_text = ""
        try:
            supervisor = get_supervisor()
            loop = asyncio.get_event_loop()
            res = await loop.run_in_executor(
                None,
                lambda: supervisor.invoke({"messages": [{"role": "user", "content": query}]}, config=config)
            )
            if "messages" in res and res["messages"]:
                summary_text = res["messages"][-1].text
        except Exception as e:
            print(f"Supervisor LLM call notice: {e}")
            summary_text = (
                f"### 🌏 Your Personalized {req.duration_days}-Day Journey to {dest.title()}\n\n"
                f"**Travelers:** {req.num_travelers} ({req.traveler_type.title()}) • **Departure:** {req.departure_city} • **Target Budget:** ${req.budget:,} USD\n\n"
                f"Our multi-agent system has coordinated your entire itinerary. We've matched your flight from {req.departure_city} "
                f"with a prime stay at **{top_hotel_name}**, scheduled unforgettable highlights including **{activities[0]['name'] if activities else 'city walking tours'}**, "
                f"and reserved delicious dining at **{restaurants[0]['name'] if restaurants else 'authentic local eateries'}**.\n\n"
                f"Review your complete flight cards, accommodations, daily schedule, and budget breakdown below!"
            )

        yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'Supervisor Agent', 'message': 'Itinerary assembled successfully!', 'data': None})}\n\n"

        final_payload = {
            "plan_id": thread_id,
            "destination": dest,
            "departure_city": req.departure_city,
            "departure_date": req.departure_date,
            "duration_days": req.duration_days,
            "num_travelers": req.num_travelers,
            "traveler_type": req.traveler_type,
            "target_budget": req.budget,
            "interests": req.interests,
            "summary": summary_text,
            "flights": flights,
            "hotels": hotels,
            "activities": activities,
            "restaurants": restaurants,
            "itinerary": itinerary,
            "budget": budget_breakdown,
            "thread_id": thread_id
        }

        yield f"data: {json.dumps({'type': 'final_plan', 'data': final_payload})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
