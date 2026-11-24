"""
Smart Travel Planner - FastAPI Application & Multi-Agent Backend

Provides modular REST and SSE streaming endpoints connected to:
- Supervisor Agent
- Flight Agent
- Hotel Agent
- Activity Agent
- Food Agent
- Budget Agent
- Itinerary Agent
"""

import sys
import os
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure package directory is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from routes import destinations_router, plan_router, chat_router
from supervisor import create_supervisor_agent

# Initialize FastAPI App
app = FastAPI(
    title="Smart Travel Planner API",
    description="Multi-Agent AI Travel Planner backend using LangChain, LangGraph, and Groq",
    version="2.0.0"
)

# Enable CORS for React frontend (Vite port 5173 and any local dev origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Clean Modular Routers
app.include_router(destinations_router)
app.include_router(plan_router)
app.include_router(chat_router)

@app.get("/api/health")
def health_check():
    """Health check endpoint confirming active agents"""
    return {
        "status": "ok",
        "system": "Smart Travel Planner Multi-Agent Network",
        "agents": [
            "Supervisor Agent",
            "Flight Agent",
            "Hotel Agent",
            "Activity Agent",
            "Food Agent",
            "Budget Agent",
            "Itinerary Agent"
        ]
    }


# =============================================================================
# CLI INTERACTIVE MODE (PRESERVED FOR BACKWARD COMPATIBILITY)
# =============================================================================

def stream_response(agent, query: str, config: dict):
    """Stream the agent's response and print messages to terminal"""
    print(f"\n📝 User: {query}\n" + "-" * 50)
    for step in agent.stream(
        {"messages": [{"role": "user", "content": query}]},
        config=config
    ):
        for update in step.values():
            if isinstance(update, dict):
                for message in update.get("messages", []):
                    if hasattr(message, "tool_calls") and message.tool_calls:
                        for tool_call in message.tool_calls:
                            print(f"\n🔧 Calling: {tool_call['name']}")
                    elif hasattr(message, "text") and message.text:
                        if message.__class__.__name__ == "AIMessage":
                            print(f"\n🤖 Assistant:\n{message.text}")


def main_cli():
    """Run interactive terminal mode"""
    print("\n" + "=" * 70)
    print("SMART TRAVEL PLANNER - Interactive Terminal Mode")
    print("=" * 70 + "\n")
    print("Initializing agents...")

    try:
        supervisor = create_supervisor_agent(use_memory=True)
        print("✅ Ready! Type your planning questions.\n")
        print("Commands: 'quit' to exit, 'new' for new conversation\n")
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    while True:
        try:
            query = input("\n👤 You: ").strip()
            if query.lower() == "quit":
                print("\n👋 Goodbye! Happy Travels!")
                break
            elif query.lower() == "new":
                thread_id = str(uuid.uuid4())
                config = {"configurable": {"thread_id": thread_id}}
                print("🆕 Started new conversation!")
                continue
            elif not query:
                continue

            stream_response(supervisor, query, config)
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        main_cli()
    else:
        import uvicorn
        print("🚀 Starting FastAPI server on http://127.0.0.1:8000...")
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
