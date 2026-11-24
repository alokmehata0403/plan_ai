"""
Food Agent

Specialized agent for discovering local cuisine, restaurants, food markets, and dining experiences.
Handles natural language queries about culinary delights, dietary requirements, and dining styles.

- search_restaurants
- get_foodie_recommendations
"""

from langchain.agents import create_agent
from langchain.tools import tool

from tools.mock_data import get_restaurants, get_activities


@tool
def search_dining(
    destination: str,
    cuisine: str | None = None,
    price_range: str | None = None
) -> str:
    """Search for restaurants and dining spots in a destination.
    
    Args:
        destination: The destination city (e.g., 'Tokyo', 'Paris', 'Rome')
        cuisine: Type of cuisine (e.g., 'Sushi', 'Ramen', 'French', 'Italian')
        price_range: '$', '$$', '$$$', or '$$$$'
    
    Returns:
        Curated list of restaurants matching criteria
    """
    restaurants = get_restaurants(destination)
    if not restaurants:
        return f"No restaurant data found for {destination}. Local culinary recommendations will be suggested based on region."

    if cuisine:
        c_lower = cuisine.lower()
        matched = [r for r in restaurants if c_lower in r.get("cuisine", "").lower()]
        if matched:
            restaurants = matched

    if price_range:
        matched = [r for r in restaurants if r.get("price_range") == price_range]
        if matched:
            restaurants = matched

    results = [f"Found {len(restaurants)} dining option(s) in {destination}:\n"]
    for r in restaurants:
        entry = f"""🍽️ {r['name']}
   🍳 Cuisine: {r['cuisine']} | Price: {r['price_range']} | Rating: ⭐ {r['rating']}/5
   📍 Neighborhood: {r['neighborhood']}
   🏷️ Best for: {', '.join(r.get('best_for', []))}
   📝 {r.get('description', '')}
"""
        results.append(entry)

    return "\n".join(results)


@tool
def get_foodie_recommendations(
    destination: str,
    dining_style: str = "mixed",
    dietary: str | None = None
) -> str:
    """Get curated food and dining recommendations for food lovers.
    
    Args:
        destination: The destination city
        dining_style: 'street_food', 'fine_dining', 'casual', or 'mixed'
        dietary: Dietary preferences or restrictions (e.g., 'vegetarian', 'halal', 'seafood')
    
    Returns:
        Top food experiences and must-eat dishes
    """
    restaurants = get_restaurants(destination)
    activities = get_activities(destination)
    food_activities = [a for a in activities if a.get("category", "").lower() == "food"]

    result = f"🍜 CULINARY HIGHLIGHTS FOR {destination.upper()}:\n\n"
    if food_activities:
        result += "🌟 Top Food Tours & Experiences:\n"
        for fa in food_activities:
            result += f"• {fa['name']} (${fa['price']}) - {fa['description']}\n"
        result += "\n"

    result += "🍴 Recommended Dining Spots:\n"
    for r in restaurants[:4]:
        result += f"• {r['name']} ({r['cuisine']}, {r['price_range']}) - {r['neighborhood']}: {r['description']}\n"

    return result


FOOD_AGENT_PROMPT = """You are a passionate food and dining specialist. Your job is to help travelers discover exceptional dining experiences, iconic local dishes, and hidden culinary gems.

Your capabilities:
- Search and recommend restaurants across all budget tiers (street food to Michelin-starred)
- Curate food tours, tastings, and cooking workshops
- Cater to specific dietary preferences and vibes (romantic dinners, quick bites, family feasts)

When responding:
1. Recommend specific local dishes that visitors must try
2. Mention restaurant neighborhoods and price ranges
3. Provide atmosphere details and reservation tips
4. Balance convenience with authentic local flavor"""


def create_food_agent(model):
    """Create and return the food agent"""
    return create_agent(
        model,
        tools=[search_dining, get_foodie_recommendations],
        system_prompt=FOOD_AGENT_PROMPT
    )
