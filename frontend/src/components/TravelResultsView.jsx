import React, { useState } from 'react';
import { 
  Plane, 
  Hotel, 
  Compass, 
  Utensils, 
  Calendar, 
  DollarSign, 
  Clock, 
  Star, 
  MapPin, 
  Share2, 
  MessageSquare, 
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export default function TravelResultsView() {
  const { currentPlan, setCurrentView, setIsChatOpen, handleSendMessage } = useTravel();
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!currentPlan) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Trip Plan Generated</h2>
        <p className="text-slate-500 text-sm">
          Please enter your travel details to generate a customized itinerary.
        </p>
        <button
          onClick={() => setCurrentView('planner')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer"
        >
          Go to Trip Planner
        </button>
      </div>
    );
  }

  const {
    destination,
    departure_city,
    duration_days,
    num_travelers,
    traveler_type,
    target_budget,
    summary,
    flights = [],
    hotels = [],
    activities = [],
    restaurants = [],
    itinerary = [],
    budget = {}
  } = currentPlan;

  const handleAskAdvisorAboutItem = (type, title) => {
    setIsChatOpen(true);
    handleSendMessage(`Tell me more about ${title} for our ${destination} trip and any recommendations.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Trip Summary Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-1">
              <span>{departure_city}</span>
              <span>→</span>
              <span>{destination}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">{duration_days} Days</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">{num_travelers} {num_travelers === 1 ? 'Traveler' : 'Travelers'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {destination} Travel Plan
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('budget')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Budget: ${budget.grand_total?.toLocaleString() || target_budget?.toLocaleString()}</span>
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Assistant</span>
            </button>
          </div>
        </div>

        {/* Advisor note */}
        {summary && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
            {summary}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'itinerary', label: 'Day-by-Day Itinerary', icon: Calendar, count: itinerary.length },
          { id: 'flights', label: 'Flights', icon: Plane, count: flights.length },
          { id: 'hotels', label: 'Accommodations', icon: Hotel, count: hotels.length },
          { id: 'activities', label: 'Things to Do', icon: Compass, count: activities.length },
          { id: 'dining', label: 'Dining', icon: Utensils, count: restaurants.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Day-by-Day Itinerary */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {itinerary.map((dayPlan, dIdx) => (
            <div 
              key={dIdx}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center">
                    D{dayPlan.day}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {dayPlan.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {dayPlan.schedule?.length || 0} stops
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dayPlan.schedule?.map((item, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.time}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500 text-[10px]">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-medium">
                        {item.price ? (typeof item.price === 'number' ? `$${item.price}` : item.price) : 'Included'}
                      </span>
                      <button
                        onClick={() => handleAskAdvisorAboutItem('schedule', item.title)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium cursor-pointer"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Flights */}
      {activeTab === 'flights' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Available flight routes from {departure_city} to {destination}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flights.map((flight, idx) => (
              <div 
                key={flight.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{flight.airline}</h3>
                      <p className="text-xs text-slate-500">{flight.flight_number} • {flight.class}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900 font-mono">${flight.price}</span>
                      <span className="text-[11px] text-slate-400 block">per person</span>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{flight.departure_time}</span>
                      <span className="text-xs text-slate-500 block">{flight.departure_city}</span>
                    </div>

                    <div className="flex-1 px-4 text-center">
                      <span className="text-[11px] text-slate-500 block font-medium">{flight.duration}</span>
                      <div className="h-0.5 bg-slate-300 w-full my-1.5" />
                      <span className={`text-[10px] font-semibold ${flight.stops === 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {flight.stops === 0 ? 'Direct Flight' : flight.layover || `${flight.stops} Stop`}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">{flight.arrival_time}</span>
                      <span className="text-xs text-slate-500 block">{flight.arrival_city}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Total for {num_travelers} travelers: <strong>${flight.price * num_travelers}</strong></span>
                  <button
                    onClick={() => handleAskAdvisorAboutItem('flight', `${flight.airline} ${flight.flight_number}`)}
                    className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Baggage & Flight Info →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Accommodations */}
      {activeTab === 'hotels' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Selected hotels in safe, central neighborhoods
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((hotel, idx) => (
              <div 
                key={hotel.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/95 text-slate-900 text-xs font-semibold flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-black/60 text-white text-xs font-medium">
                    {hotel.neighborhood}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities?.slice(0, 3).map((amenity, aIdx) => (
                      <span key={aIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-slate-900 font-mono">${hotel.price_per_night}</span>
                      <span className="text-xs text-slate-500"> / night</span>
                    </div>
                    <button
                      onClick={() => handleAskAdvisorAboutItem('hotel', hotel.name)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Inquire →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Activities */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Recommended sights, museums, and local activities
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((act, idx) => (
              <div 
                key={act.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={act.image}
                    alt={act.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[11px]">
                    {act.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/95 text-slate-900 text-xs font-semibold flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{act.rating}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {act.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {act.duration}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {act.price > 0 ? `$${act.price}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Dining */}
      {activeTab === 'dining' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Recommended dining spots from casual local bites to evening dining
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {restaurants.map((rest, idx) => (
              <div 
                key={rest.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {rest.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {rest.cuisine} • {rest.neighborhood}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                      {rest.price_range}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rest.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rest.rating} / 5</span>
                  </div>
                  <button
                    onClick={() => handleAskAdvisorAboutItem('restaurant', rest.name)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium cursor-pointer"
                  >
                    Tips & Menu →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
