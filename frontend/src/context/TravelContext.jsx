import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchDestinations,
  fetchHealth,
  streamPlanGeneration,
  generateTripPlan,
  sendChatMessage
} from '../services/api';

const TravelContext = createContext();

export const AGENT_SPECS = [
  {
    id: "supervisor_agent",
    name: "Supervisor Agent",
    role: "Lead Travel Advisor & Orchestrator",
    icon: "Crown",
    color: "#38bdf8",
    avatar: "👑",
    description: "Evaluates requirements, coordinates specialists, and synthesizes the journey."
  },
  {
    id: "flight_agent",
    name: "Flight Agent",
    role: "Aviation & Route Specialist",
    icon: "Plane",
    color: "#0ea5e9",
    avatar: "✈️",
    description: "Scans airlines, layovers, departure windows, and airfares."
  },
  {
    id: "hotel_agent",
    name: "Hotel Agent",
    role: "Accommodations & Stays Expert",
    icon: "Building2",
    color: "#3b82f6",
    avatar: "🏨",
    description: "Finds luxury hotels, boutique guesthouses, and family suites."
  },
  {
    id: "activity_agent",
    name: "Activity Agent",
    role: "Attractions & Experiences Curator",
    icon: "Compass",
    color: "#f59e0b",
    avatar: "🎯",
    description: "Discovers iconic monuments, private tours, and hidden local gems."
  },
  {
    id: "food_agent",
    name: "Food Agent",
    role: "Culinary & Dining Specialist",
    icon: "UtensilsCrossed",
    color: "#10b981",
    avatar: "🍜",
    description: "Curates street food markets, authentic ramen, and fine dining."
  },
  {
    id: "budget_agent",
    name: "Budget Agent",
    role: "Financial & Value Optimizer",
    icon: "Calculator",
    color: "#8b5cf6",
    avatar: "💰",
    description: "Itemizes expenses, analyzes feasibility, and maximizes value."
  }
];

export function TravelProvider({ children }) {
  // Navigation / views: 'landing' | 'planner' | 'dashboard' | 'budget' | 'chat'
  const [currentView, setCurrentView] = useState('landing');
  const [destinations, setDestinations] = useState([]);
  const [serverHealth, setServerHealth] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    destination: 'Tokyo',
    departure_city: 'Los Angeles',
    departure_date: '2026-12-10',
    duration_days: 5,
    num_travelers: 2,
    traveler_type: 'couple',
    budget: 3000,
    interests: ['culture', 'food'],
    trip_pace: 'moderate',
    notes: 'Prefer direct flights and centrally located boutique hotel'
  });

  // Multi-Agent Execution State
  const [isPlanning, setIsPlanning] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState({
    supervisor_agent: { status: 'idle', message: 'Standing by', progress: 0 },
    flight_agent: { status: 'idle', message: 'Standing by', progress: 0 },
    hotel_agent: { status: 'idle', message: 'Standing by', progress: 0 },
    activity_agent: { status: 'idle', message: 'Standing by', progress: 0 },
    food_agent: { status: 'idle', message: 'Standing by', progress: 0 },
    budget_agent: { status: 'idle', message: 'Standing by', progress: 0 },
  });
  const [agentLogs, setAgentLogs] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  // Active Generated Plan
  const [currentPlan, setCurrentPlan] = useState(null);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm your AI Travel Advisor. I coordinate our team of flight, hotel, activity, food, and budget specialists to craft your dream trip. Where are you dreaming of going next?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load initial destinations and health check
  useEffect(() => {
    async function init() {
      const [dests, health] = await Promise.all([
        fetchDestinations(),
        fetchHealth()
      ]);
      setDestinations(dests);
      setServerHealth(health);
    }
    init();
  }, []);

  const addAgentLog = (agentName, message, type = 'info') => {
    setAgentLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        agent: agentName,
        message,
        type
      }
    ]);
  };

  const resetAgentStates = () => {
    setAgentStatuses({
      supervisor_agent: { status: 'idle', message: 'Ready to coordinate', progress: 0 },
      flight_agent: { status: 'idle', message: 'Ready to search routes', progress: 0 },
      hotel_agent: { status: 'idle', message: 'Ready to scan accommodations', progress: 0 },
      activity_agent: { status: 'idle', message: 'Ready to curate experiences', progress: 0 },
      food_agent: { status: 'idle', message: 'Ready to scout culinary spots', progress: 0 },
      budget_agent: { status: 'idle', message: 'Ready to calculate expenses', progress: 0 },
    });
    setAgentLogs([]);
    setOverallProgress(0);
  };

  // Start the Multi-Agent Planner via real-time SSE stream
  const startPlanning = async (customForm = null) => {
    const activeParams = customForm || formData;
    setIsPlanning(true);
    resetAgentStates();
    setCurrentView('dashboard');

    const agentKeyMap = {
      'Supervisor Agent': 'supervisor_agent',
      'Flight Agent': 'flight_agent',
      'Hotel Agent': 'hotel_agent',
      'Activity Agent': 'activity_agent',
      'Food Agent': 'food_agent',
      'Budget Agent': 'budget_agent',
    };

    let stepCount = 0;
    const totalSteps = 7;

    try {
      await streamPlanGeneration(
        activeParams,
        (event) => {
          if (event.type === 'agent_start') {
            const key = agentKeyMap[event.agent] || 'supervisor_agent';
            setAgentStatuses(prev => ({
              ...prev,
              [key]: { status: 'active', message: event.message, progress: 50 }
            }));
            addAgentLog(event.agent, event.message, 'active');
            stepCount = Math.min(stepCount + 1, totalSteps);
            setOverallProgress(Math.round((stepCount / totalSteps) * 100));
          } else if (event.type === 'agent_complete') {
            const key = agentKeyMap[event.agent] || 'supervisor_agent';
            setAgentStatuses(prev => ({
              ...prev,
              [key]: { status: 'completed', message: event.message, progress: 100 }
            }));
            addAgentLog(event.agent, event.message, 'completed');
          } else if (event.type === 'final_plan') {
            setCurrentPlan(event.data);
            setThreadId(event.data.thread_id);
            setOverallProgress(100);
            
            // Trigger celebration confetti
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {
              // Confetti fallback
            }

            // Auto-transition to results view after brief celebration
            setTimeout(() => {
              setCurrentView('results');
            }, 2000);

            // Add note to chat history
            setChatMessages(prev => [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'assistant',
                text: `🎉 Your personalized itinerary for **${event.data.destination}** has been generated! Feel free to ask me any questions or ask to adjust hotels, flights, or days.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        },
        async (error) => {
          console.error("Stream failed, falling back to REST /api/plan:", error);
          addAgentLog("System", "Switching to direct API synthesis...", "warning");
          try {
            const plan = await generateTripPlan(activeParams);
            setCurrentPlan(plan);
            setThreadId(plan.thread_id);
            setOverallProgress(100);
          } catch (e2) {
            console.error("Direct API plan failed too:", e2);
            addAgentLog("Supervisor", "Error generating plan: " + e2.message, "error");
          }
        },
        () => {
          setIsPlanning(false);
        }
      );
    } catch (err) {
      console.error("Plan execution error:", err);
      setIsPlanning(false);
    }
  };

  const handleSendMessage = async (userText) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage(
        userText,
        threadId,
        currentPlan?.destination || formData.destination
      );

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      if (response.thread_id) setThreadId(response.thread_id);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: "I'm having trouble connecting right now, but your trip details are saved! You can try asking again in a moment.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      destination: preset.destination,
      departure_city: preset.departure_city || 'Los Angeles',
      duration_days: preset.duration_days,
      num_travelers: preset.num_travelers,
      traveler_type: preset.traveler_type,
      budget: preset.budget,
      interests: preset.interests,
      trip_pace: preset.trip_pace || 'moderate',
      notes: preset.notes || ''
    }));
    startPlanning({
      ...formData,
      destination: preset.destination,
      departure_city: preset.departure_city || 'Los Angeles',
      duration_days: preset.duration_days,
      num_travelers: preset.num_travelers,
      traveler_type: preset.traveler_type,
      budget: preset.budget,
      interests: preset.interests,
      trip_pace: preset.trip_pace || 'moderate',
      notes: preset.notes || ''
    });
  };

  return (
    <TravelContext.Provider
      value={{
        currentView,
        setCurrentView,
        destinations,
        serverHealth,
        formData,
        setFormData,
        isPlanning,
        agentStatuses,
        agentLogs,
        overallProgress,
        currentPlan,
        setCurrentPlan,
        chatMessages,
        isChatLoading,
        isChatOpen,
        setIsChatOpen,
        startPlanning,
        handleSendMessage,
        applyPreset,
        resetAgentStates
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
}
