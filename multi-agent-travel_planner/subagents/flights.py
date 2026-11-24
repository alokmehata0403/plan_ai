"""
Specialized for searching and recommending flights

It handles natural language queries about flight options, prices, and schedules

- search_flights
- compare_flight_prices
"""

from langchain.agents import create_agent
from langchain.tools import tool

from tools.mock_data import get_flights


@tool
def search_flights(
    origin_city: str,
    destination: str,
    budget_max: int | None = None,
    preferred_stops: str = "any"
) -> str:
    """Search flights between two cities.

    Args:
        origin_city: Departure city.
        destination: Arrival city.
        budget_max: Maximum price per person in USD.
        preferred_stops: direct, one-stop, or any.
    """

    flights = get_flights(destination, origin_city)

    if not flights:
        return (
            f"No mock flights available from {origin_city} "
            f"to {destination}. Please try another route."
        )

    if budget_max is not None:
        flights = [
            f for f in flights
            if f["price"] <= budget_max
        ]

    if preferred_stops == "direct":
        flights = [f for f in flights if f["stops"] == 0]

    elif preferred_stops == "one-stop":
        flights = [f for f in flights if f["stops"] == 1]

    if not flights:
        return "No flights match your selected filters."

    results = [
        f"Flights from {origin_city} to {destination}:"
    ]

    for flight in flights:
        results.append(
            f"""
Airline: {flight['airline']}
Flight: {flight['flight_number']}
Route: {flight['departure_city']} -> {flight['arrival_city']}
Departure: {flight['departure_time']}
Arrival: {flight['arrival_time']}
Duration: {flight['duration']}
Stops: {flight['stops']}
Price: ${flight['price']} USD
"""
        )

    return "\n".join(results)



@tool
def compare_flight_prices(
    origin_city: str,
    destination: str
) -> str:
    """Compare flight prices for a specific route."""

    flights = get_flights(destination, origin_city)

    if not flights:
        return (
            f"No mock flights available from {origin_city} "
            f"to {destination}."
        )

    sorted_flights = sorted(
        flights, key=lambda x: x["price"]
    )

    cheapest = sorted_flights[0]

    direct_flights = [
        f for f in flights if f["stops"] == 0
    ]

    best_value = (
        min(direct_flights, key=lambda x: x["price"])
        if direct_flights else cheapest
    )

    return f"""
Flight Price Comparison
Route: {origin_city} -> {destination}

CHEAPEST:
{cheapest['airline']} - ${cheapest['price']}

BEST VALUE:
{best_value['airline']} - ${best_value['price']}

PRICE RANGE:
${sorted_flights[0]['price']} - ${sorted_flights[-1]['price']}
"""



FLIGHTS_AGENT_PROMPT = """
You are a flight search specialist.

Rules:
1. Always identify departure city.
2. Always identify destination city.
3. Never assume New York as departure city.
4. Never invent departure or arrival cities.
5. Always pass origin_city and destination
   to the flight tools.
6. If departure city is missing, ask the user.
7. Only show flights matching the requested route.
8. If no mock flights exist, clearly explain this.

Always show airline, flight number, route,
price, duration and stops.
"""


def create_flights_agent(model):
    """Create and return the flight agent"""
    return create_agent(
        model,
        tools=[search_flights, compare_flight_prices],
        system_prompt=FLIGHTS_AGENT_PROMPT
    )

