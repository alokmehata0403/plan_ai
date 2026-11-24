import React, { useState } from 'react';
import { Compass, MessageSquare, MapPin, Calendar, DollarSign, Bot, Menu, X, ArrowRight } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export default function Navbar() {
  const { currentView, setCurrentView, isPlanning, setIsChatOpen, chatMessages, currentPlan } = useTravel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('landing')} 
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                PlanAI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Travel
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">Smart Travel Planner</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'landing'
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setCurrentView('planner')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'planner'
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Trip Planner
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'text-blue-600 bg-blue-50/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <span>Agent Status</span>
            {isPlanning && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            )}
          </button>
          {currentPlan && (
            <>
              <button
                onClick={() => setCurrentView('results')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentView === 'results'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setCurrentView('budget')}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                  currentView === 'budget'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>Budget</span>
              </button>
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* AI Chat Drawer Trigger */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Chat with Travel Assistant"
          >
            <MessageSquare className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Assistant</span>
            {chatMessages.length > 1 && (
              <span className="w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {chatMessages.length - 1}
              </span>
            )}
          </button>

          {/* Plan Trip CTA */}
          <button
            onClick={() => setCurrentView('planner')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
          >
            <span>Plan a Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 bg-white border-b border-slate-200 space-y-1">
          <button
            onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Explore Destinations
          </button>
          <button
            onClick={() => { setCurrentView('planner'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Trip Planner
          </button>
          <button
            onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Agent Status
          </button>
          {currentPlan && (
            <>
              <button
                onClick={() => { setCurrentView('results'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                View Itinerary
              </button>
              <button
                onClick={() => { setCurrentView('budget'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Budget Breakdown
              </button>
            </>
          )}
          <button
            onClick={() => { setIsChatOpen(true); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 flex items-center justify-between"
          >
            <span>Ask Travel Assistant</span>
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
