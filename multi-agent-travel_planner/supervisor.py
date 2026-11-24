"""
Supervisor Agent

The main orchestrating agent that coordinates specialized subagents
to create comprehensive travel plans.

This implements the SubAgents pattern where:
- Supervisor receives user requests and makes routing decisions
- Subagents are wrapped as tools for the supervisor to call
- Results flow back to supervisor for synthesis
"""

import os
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import InMemorySaver
from groq import RateLimitError

load_dotenv()

from subagents import (
    create_flights_agent,
    create_hotels_agent,
    create_activities_agent,
    create_itinerary_agent,
    create_food_agent,
    create_budget_agent,
)

_agents = None


def initialize_agents(model_name: str = "openai/gpt-oss-120b"):
    """Initialize the model and all specialized subagents."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError(
            "GROQ_API_KEY is missing. Check your backend .env file."
        )

    # Initialize Groq model
    model = init_chat_model(
        model_name,
        model_provider="groq",
        api_key=api_key
    )

    # Retry only when Groq returns a rate-limit error
    model = model.with_retry(
        retry_if_exception_type=(RateLimitError,),
        stop_after_attempt=3,
        wait_exponential_jitter=True,
    )

    print(f"Travel agents initialized with model: {model_name}")

    return {
        "model": model,
        "flights_agent": create_flights_agent(model),
        "hotels_agent": create_hotels_agent(model),
        "activities_agent": create_activities_agent(model),
        "itinerary_agent": create_itinerary_agent(model),
        "food_agent": create_food_agent(model),
        "budget_agent": create_budget_agent(model),
    }


    return {
        "model": model,
        "flights_agent": create_flights_agent(model),
        "hotels_agent": create_hotels_agent(model),
        "activities_agent": create_activities_agent(model),
        "itinerary_agent": create_itinerary_agent(model),
        "food_agent": create_food_agent(model),
        "budget_agent": create_budget_agent(model),
    }

def get_agents():
    """Get or initialize agents singleton"""
    global _agents
    if _agents is None:
        _agents = initialize_agents()
    return _agents

# Wrap Each SubAgent in a Tool

@tool
def search_flights(request: str) -> str:
    """Search for flights to a destination.
    
    Use this when the user needs to find flights. Pass the full context including:
    - Destination city
    - Travel dates (if mentioned)
    - Budget constraints (if mentioned)
    - Preferences (direct flights, specific airlines, etc.)
    
    Example: "Find flights to Tokyo, budget around $800, prefer direct flights"
    """
    agents = get_agents()
    result = agents["flights_agent"].invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def search_hotels(request: str) -> str:
    """Search for hotels and accommodations.
    
    Use this when the user needs to find places to stay. Pass the full context including:
    - Destination city
    - Traveler type (solo, couple, family, etc.)
    - Budget per night (if mentioned)
    - Preferences (amenities, location, etc.)
    
    Example: "Find family-friendly hotels in Tokyo, budget $200/night, need pool"
    """
    agents = get_agents()
    result = agents["hotels_agent"].invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def search_activities(request: str) -> str:
    """Search for things to do, attractions, and sightseeing experiences.
    
    Use this when the user wants to discover activities, cultural sights, or outdoor experiences. 
    Pass the full context including:
    - Destination city
    - Interests (culture, food, nature, adventure, art, etc.)
    - Trip style (relaxed, packed, romantic, etc.)
    - Any specific requests
    
    Example: "Find cultural activities and shrines in Tokyo"
    """
    agents = get_agents()
    result = agents["activities_agent"].invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def search_food(request: str) -> str:
    """Search for restaurants, dining, and local culinary experiences.
    
    Use this when finding places to eat, local culinary specialties, food markets, or dinner reservations.
    Pass context including destination, cuisine, price range, and vibe.
    
    Example: "Recommend best sushi, ramen, and izakaya dining in Tokyo"
    """
    agents = get_agents()
    result = agents["food_agent"].invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def analyze_budget(request: str) -> str:
    """Calculate expense breakdowns and evaluate budget feasibility.
    
    Use this to itemize flights, lodging, meals, activities, and transit, and check against user budget.
    
    Example: "Calculate budget breakdown for a 5-day Tokyo trip for 2 travelers with $3000 budget"
    """
    agents = get_agents()
    result = agents["budget_agent"].invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text

@tool
def create_itinerary(request: str) -> str:
    """Create and organize a trip itinerary.
    
    Use this to organize flights, hotels, activities, and meals into a cohesive day-by-day plan.
    Pass the full context including:
    - All selected components (flight, hotel, activities, food)
    - Number of days
    - Trip pace preference (relaxed, moderate, packed)
    - Any scheduling preferences
    
    Example: "Create a 5-day Tokyo itinerary with the selected hotel and activities"
    """
    agents = get_agents()
    result = agents["itinerary_agent"].invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text


SUPERVISOR_PROMPT = """You are a professional travel planning advisor. Your job is to help users plan their dream trips by coordinating specialized travel experts.

You have access to six specialist tools:
1. search_flights - Find and compare flight options
2. search_hotels - Find accommodations matching preferences  
3. search_activities - Discover things to do, attractions, and cultural experiences
4. search_food - Discover local restaurants, dining, and culinary tours
5. analyze_budget - Calculate detailed cost breakdowns and evaluate feasibility
6. create_itinerary - Organize everything into an optimized day-by-day plan

WORKFLOW GUIDELINES:

For a complete trip planning request:
1. Understand the user's needs (destination, dates/duration, travelers, budget, interests)
2. Search flights to identify the best flight routes and prices
3. Search hotels matching their traveler profile and budget
4. Search activities aligned with their interests
5. Search food & dining for top culinary experiences
6. Analyze budget to ensure estimates stay within or close to target
7. Create an itinerary that synthesizes all selections into a seamless day-by-day schedule

For partial requests (e.g., "just find flights" or "recommend restaurants"):
- Only call the relevant specialist
- Provide focused, actionable advice

RESPONSE GUIDELINES:
- Be warm, professional, and knowledgeable
- Summarize findings clearly with emoji visual anchors
- Make specific recommendations and explain trade-offs
- Highlight local insider tips
- Provide a cohesive travel experience recommendation
"""


def create_supervisor_agent(
    model_name: str = "openai/gpt-oss-120b",
    use_memory: bool = True
):
    """Create and return the supervisor agent.
    
    Args:
        model_name: The model to use for the supervisor
        use_memory: Whether to enable conversation memory (checkpointing)
    
    Returns:
        Configured supervisor agent
    """
    global _agents
    _agents = initialize_agents(model_name)

    supervisor = create_agent(
        _agents["model"],
        tools=[search_flights, search_hotels, search_activities, search_food, analyze_budget, create_itinerary],
        system_prompt=SUPERVISOR_PROMPT,
        checkpointer=InMemorySaver() if use_memory else None
    )

    return supervisor
