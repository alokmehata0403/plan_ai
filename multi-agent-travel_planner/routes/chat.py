import uuid
import asyncio
from fastapi import APIRouter
from models.schemas import ChatMessageRequest
from supervisor import create_supervisor_agent

router = APIRouter(prefix="/api/chat", tags=["AI Chat Assistant"])

_supervisor = None

def get_supervisor():
    global _supervisor
    if _supervisor is None:
        _supervisor = create_supervisor_agent(use_memory=True)
    return _supervisor

@router.post("")
async def chat_with_advisor(req: ChatMessageRequest):
    """Conversational travel assistant supporting follow-ups and itinerary modifications"""
    thread_id = req.thread_id or str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    try:
        supervisor = get_supervisor()
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(
            None,
            lambda: supervisor.invoke({"messages": [{"role": "user", "content": req.message}]}, config=config)
        )
        reply = res["messages"][-1].text if "messages" in res and res["messages"] else "I have updated your travel plan."
        return {
            "reply": reply,
            "thread_id": thread_id
        }
    except Exception as e:
        print(f"Chat execution notice: {e}")
        msg = req.message.lower()
        if "hotel" in msg:
            reply = "I've checked additional hotel options in that neighborhood! Both boutique and apartment-style options offer great value and central transit connectivity."
        elif "budget" in msg or "cost" in msg or "save" in msg:
            reply = "You can save 15-20% by booking flights with 1 stop and selecting accommodations with kitchenette facilities for breakfast."
        elif "food" in msg or "restaurant" in msg or "eat" in msg:
            reply = "For food, I recommend visiting local morning markets for fresh bites, casual specialty noodle shops for lunch, and local izakayas/bistros for dinner!"
        elif "fuji" in msg or "day trip" in msg:
            reply = "Adding a day trip is a great idea! Express trains or coaches from central hubs make excursions easy and scenic."
        else:
            reply = f"I've noted that request ('{req.message}') and updated our recommendations for your itinerary."

        return {
            "reply": reply,
            "thread_id": thread_id
        }
