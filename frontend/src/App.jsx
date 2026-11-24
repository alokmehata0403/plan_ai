import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import PopularDestinations from './components/PopularDestinations';
import FeaturesSection from './components/FeaturesSection';
import TripPlannerView from './components/TripPlannerView';
import AgentDashboard from './components/AgentDashboard';
import TravelResultsView from './components/TravelResultsView';
import BudgetDashboardView from './components/BudgetDashboardView';
import ChatDrawer from './components/ChatDrawer';
import { useTravel } from './context/TravelContext';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const { currentView, setIsChatOpen, chatMessages, isPlanning } = useTravel();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <div>
            <HeroSection />
            <PopularDestinations />
            <FeaturesSection />
          </div>
        )}

        {currentView === 'planner' && <TripPlannerView />}

        {currentView === 'dashboard' && <AgentDashboard />}

        {currentView === 'results' && <TravelResultsView />}

        {currentView === 'budget' && <BudgetDashboardView />}
      </main>

      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="relative px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-lg flex items-center gap-2 transition-all transform hover:scale-102 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Travel Assistant</span>
          {chatMessages.length > 1 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {chatMessages.length - 1}
            </span>
          )}
          {isPlanning && (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          )}
        </button>
      </div>

      {/* AI Chat Slide-over Drawer */}
      <ChatDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
