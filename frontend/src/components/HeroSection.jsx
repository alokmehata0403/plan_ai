import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Check, 
  Sparkles,
  Plane,
  Building2,
  Compass,
  Utensils
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export default function HeroSection() {
  const { formData, setFormData, startPlanning, setCurrentView } = useTravel();
  const [quickDest, setQuickDest] = useState(formData.destination || 'Tokyo');
  const [quickDeparture, setQuickDeparture] = useState(formData.departure_city || 'Los Angeles');
  const [quickDuration, setQuickDuration] = useState(formData.duration_days || 5);
  const [quickTravelers, setQuickTravelers] = useState(formData.num_travelers || 2);
  const [quickBudget, setQuickBudget] = useState(formData.budget || 3000);

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      destination: quickDest,
      departure_city: quickDeparture,
      duration_days: Number(quickDuration),
      num_travelers: Number(quickTravelers),
      budget: Number(quickBudget)
    };
    setFormData(updated);
    startPlanning(updated);
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 pt-12 pb-20 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Travel Planning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Plan your next journey, <br className="hidden sm:inline" />
            <span className="text-blue-600">tailored perfectly to you.</span>
          </h1>

          <p className="text-base text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Enter your destination, dates, and budget. Specialized agents collaborate to organize flight options, handpicked stays, authentic activities, and day-by-day itineraries.
          </p>
        </div>

        {/* Clean Airbnb-Style Search Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-lg shadow-slate-200/50">
            <form onSubmit={handleHeroSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Destination */}
              <div className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Where to?
                </label>
                <select
                  value={quickDest}
                  onChange={(e) => setQuickDest(e.target.value)}
                  className="w-full bg-transparent text-slate-900 font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Tokyo">Tokyo, Japan</option>
                  <option value="Paris">Paris, France</option>
                  <option value="Rome">Rome, Italy</option>
                  <option value="Bali">Bali, Indonesia</option>
                  <option value="New York">New York, USA</option>
                </select>
              </div>

              {/* Departure */}
              <div className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-blue-600" />
                  Depart from
                </label>
                <input
                  type="text"
                  value={quickDeparture}
                  onChange={(e) => setQuickDeparture(e.target.value)}
                  placeholder="e.g. Los Angeles"
                  className="w-full bg-transparent text-slate-900 font-semibold text-sm focus:outline-none"
                  required
                />
              </div>

              {/* Duration */}
              <div className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Duration
                </label>
                <select
                  value={quickDuration}
                  onChange={(e) => setQuickDuration(e.target.value)}
                  className="w-full bg-transparent text-slate-900 font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={10}>10 Days</option>
                </select>
              </div>

              {/* Budget */}
              <div className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  Budget
                </label>
                <select
                  value={quickBudget}
                  onChange={(e) => setQuickBudget(e.target.value)}
                  className="w-full bg-transparent text-slate-900 font-semibold text-sm focus:outline-none cursor-pointer"
                >
                  <option value={1500}>$1,500</option>
                  <option value={3000}>$3,000</option>
                  <option value={5000}>$5,000</option>
                  <option value={8000}>$8,000</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[46px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

            {/* Quick destination tags */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Quick ideas:</span>
                {['Tokyo', 'Paris', 'Rome', 'Bali', 'New York'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setQuickDest(city);
                      setFormData(prev => ({ ...prev, destination: city }));
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      quickDest === city
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('planner')}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 ml-auto"
              >
                Detailed Form Options →
              </button>
            </div>
          </div>
        </div>

        {/* Natural Trust Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-xs text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Flight Comparison</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-xs text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Handpicked Stays</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-xs text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Daily Itineraries</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-xs text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Budget Control</span>
          </div>
        </div>

      </div>
    </section>
  );
}
