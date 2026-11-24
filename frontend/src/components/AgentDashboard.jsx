import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Plane,
  Building2,
  Compass,
  Utensils,
  DollarSign,
  UserCheck,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export default function AgentDashboard() {
  const { 
    agentStatuses, 
    agentLogs, 
    overallProgress, 
    isPlanning, 
    currentPlan, 
    setCurrentView,
    startPlanning,
    formData
  } = useTravel();

  const steps = [
    {
      id: 'flight_agent',
      label: 'Flight Route Specialist',
      desc: 'Finding best route, airlines, and schedule options',
      icon: Plane
    },
    {
      id: 'hotel_agent',
      label: 'Accommodations Specialist',
      desc: 'Shortlisting hotels matching your travel profile',
      icon: Building2
    },
    {
      id: 'activity_agent',
      label: 'Activities & Sightseeing',
      desc: 'Curating attractions, cultural tours, and tickets',
      icon: Compass
    },
    {
      id: 'food_agent',
      label: 'Dining & Food Specialist',
      desc: 'Finding local restaurants and culinary highlights',
      icon: Utensils
    },
    {
      id: 'budget_agent',
      label: 'Budget & Cost Balancer',
      desc: 'Calculating category costs and verifying feasibility',
      icon: DollarSign
    },
    {
      id: 'supervisor_agent',
      label: 'Itinerary Coordinator',
      desc: 'Assembling seamless daily schedule and advice',
      icon: UserCheck
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Trip Preparation
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Organizing your {formData.destination} Trip
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {formData.departure_city} • {formData.duration_days} Days • {formData.num_travelers} Travelers • Budget ${formData.budget.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentPlan ? (
              <button
                onClick={() => setCurrentView('results')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>View Full Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => startPlanning()}
                disabled={isPlanning}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPlanning ? 'animate-spin' : ''}`} />
                <span>{isPlanning ? 'Processing...' : 'Start Planning'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-medium text-slate-700">
            <span>Overall Progress</span>
            <span className="font-mono text-blue-600">{overallProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Step Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Specialist Status
          </h3>

          <div className="divide-y divide-slate-100">
            {steps.map((step) => {
              const state = agentStatuses[step.id] || { status: 'idle', message: 'Pending' };
              const Icon = step.icon;
              const isWorking = state.status === 'active';
              const isComplete = state.status === 'completed';

              return (
                <div key={step.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isComplete 
                        ? 'bg-emerald-50 text-emerald-600'
                        : isWorking 
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{step.label}</span>
                        {isWorking && (
                          <span className="text-[10px] font-normal text-blue-600 animate-pulse">
                            (working...)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {state.message || step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Ready</span>
                      </span>
                    ) : isWorking ? (
                      <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs text-slate-400">Waiting</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary note when done */}
        {currentPlan && (
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Trip plan ready!</span> Review your flight options, hotel picks, day-by-day plan, and budget breakdown.
            </div>
            <button
              onClick={() => setCurrentView('results')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs whitespace-nowrap cursor-pointer"
            >
              Open Itinerary →
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
