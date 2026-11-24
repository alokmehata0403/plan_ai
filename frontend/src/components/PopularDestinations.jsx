import React from 'react';
import { Star, MapPin, Plane, Hotel, ArrowRight } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export default function PopularDestinations() {
  const { destinations, setFormData, startPlanning, formData } = useTravel();

  const handleDestinationClick = (dest) => {
    const updated = {
      ...formData,
      destination: dest.name,
      budget: dest.base_flight_est * 2 + dest.base_hotel_est * 4 + 1000
    };
    setFormData(updated);
    startPlanning(updated);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Destinations
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Popular cities with verified flight routes, vetted accommodations, and curated activities.
            </p>
          </div>
          <div className="mt-3 md:mt-0 text-slate-500 text-xs">
            Select a city to generate a complete custom plan
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <div
              key={dest.id || idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              {/* Image & Header */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* Rating badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-slate-900 shadow-xs flex items-center gap-1 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating || '4.9'}</span>
                </div>

                {/* Country */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{dest.country}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {dest.popular_tags?.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Pricing row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-slate-400" />
                    <span>Flights from <strong>${dest.base_flight_est || 650}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5 text-slate-400" />
                    <span>Stays from <strong>${dest.base_hotel_est || 140}</strong>/nt</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => handleDestinationClick(dest)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Plan Trip to {dest.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
