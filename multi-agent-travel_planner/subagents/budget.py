"""
Budget Agent

Specialized agent for estimating total trip expenses, evaluating budget feasibility,
and producing clear category breakdowns (flights, accommodation, food, activities, local transit).

- estimate_trip_budget
- analyze_budget_feasibility
"""

from langchain.agents import create_agent
from langchain.tools import tool


@tool
def estimate_trip_budget(
    destination: str,
    duration_days: int,
    num_travelers: int = 1,
    flight_est: int | None = None,
    hotel_per_night: int | None = None,
    budget_tier: str = "moderate"
) -> str:
    """Calculate an estimated trip budget breakdown.
    
    Args:
        destination: Destination city
        duration_days: Number of days
        num_travelers: Number of travelers
        flight_est: Estimated flight cost per person
        hotel_per_night: Estimated hotel cost per night (shared per room)
        budget_tier: 'budget', 'moderate', or 'luxury'
    
    Returns:
        Structured budget calculation and category breakdown
    """
    tier = budget_tier.lower()
    if tier == "luxury":
        daily_food_per_person = 150
        daily_activities_per_person = 100
        daily_transit_per_person = 35
        hotel_default = 450
        flight_default = 1200
    elif tier == "budget":
        daily_food_per_person = 40
        daily_activities_per_person = 25
        daily_transit_per_person = 15
        hotel_default = 100
        flight_default = 600
    else:  # moderate
        daily_food_per_person = 75
        daily_activities_per_person = 50
        daily_transit_per_person = 20
        hotel_default = 180
        flight_default = 800

    flight_cost = (flight_est if flight_est else flight_default) * num_travelers
    rooms_needed = max(1, (num_travelers + 1) // 2)
    hotel_cost = (hotel_per_night if hotel_per_night else hotel_default) * (duration_days - 1 if duration_days > 1 else 1) * rooms_needed
    food_cost = daily_food_per_person * duration_days * num_travelers
    activities_cost = daily_activities_per_person * duration_days * num_travelers
    transit_cost = daily_transit_per_person * duration_days * num_travelers
    contingency = int((flight_cost + hotel_cost + food_cost + activities_cost + transit_cost) * 0.10)
    total = flight_cost + hotel_cost + food_cost + activities_cost + transit_cost + contingency

    result = f"""💰 ESTIMATED BUDGET BREAKDOWN ({duration_days} Days in {destination.title()} for {num_travelers} Traveler(s) - {budget_tier.title()} Tier):

✈️ Flights: ${flight_cost:,} (${flight_cost // num_travelers:,} / person)
🏨 Accommodations: ${hotel_cost:,} (${hotel_cost // (duration_days - 1 if duration_days > 1 else 1):,} / night)
🍽️ Food & Dining: ${food_cost:,} (~${daily_food_per_person}/day/person)
🎯 Activities & Sightseeing: ${activities_cost:,}
🚆 Local Transit & Transfers: ${transit_cost:,}
🛡️ Contingency & Incidentals (10%): ${contingency:,}
─────────────────────────────────────────────
💵 TOTAL ESTIMATED TRIP COST: ${total:,} USD (${total // num_travelers:,} / person)
"""
    return result


@tool
def analyze_budget_feasibility(
    target_budget: int,
    destination: str,
    duration_days: int,
    num_travelers: int = 1
) -> str:
    """Analyze if a specified budget is realistic for the requested destination and duration.
    
    Args:
        target_budget: User's total budget in USD
        destination: Destination city
        duration_days: Trip duration in days
        num_travelers: Number of travelers
    
    Returns:
        Feasibility analysis and saving tips
    """
    per_person = target_budget // num_travelers
    per_day = per_person // duration_days

    if per_day < 80:
        verdict = "⚠️ TIGHT BUDGET: Feasible with hostels, street food, and free walking tours."
        tips = "Book flights early, stay in guesthouses, buy daily transit passes, and dine at local casual markets."
    elif per_day < 200:
        verdict = "✅ HEALTHY MODERATE BUDGET: Comfortably covers 3-4 star hotels, good restaurants, and guided tours."
        tips = "Great balance of comfort and value. Allows 1-2 splurge dining experiences."
    else:
        verdict = "💎 LUXURY BUDGET: Ample room for 5-star hotels, fine dining, private guides, and premium experiences."
        tips = "Consider boutique 5-star stays, Michelin dining reservations, and private airport transfers."

    return f"""Budget Feasibility for {destination.title()} (${target_budget:,} for {num_travelers} people / {duration_days} days):
• Budget per person per day: ${per_day}
• Analysis: {verdict}
• Advisor Advice: {tips}
"""


BUDGET_AGENT_PROMPT = """You are a travel finance and budgeting expert. Your job is to ensure travelers understand trip costs, stay within budget constraints, and optimize value.

Your capabilities:
- Estimate comprehensive costs across flights, hotels, meals, activities, and transit
- Calculate realistic category distributions and percentages
- Evaluate if a given budget is feasible and suggest trade-offs (e.g. boutique hotel vs splurge dining)
- Highlight hidden costs (resort fees, city taxes, tips, airport trains)

When responding:
1. Provide itemized expense breakdowns
2. Always calculate per-person and total numbers
3. Offer cost-saving tips and value optimization ideas"""


def create_budget_agent(model):
    """Create and return the budget agent"""
    return create_agent(
        model,
        tools=[estimate_trip_budget, analyze_budget_feasibility],
        system_prompt=BUDGET_AGENT_PROMPT
    )
