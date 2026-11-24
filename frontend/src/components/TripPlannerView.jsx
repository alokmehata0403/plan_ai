import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  ArrowRight, 
  Check, 
  Clock, 
  Sliders,
  Utensils,
  Camera,
  Trees,
  ShoppingBag,
  Palmtree,
  Landmark,
  Wine
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

const AVAILABLE_INTERESTS = [
  { id: 'culture', label: 'Culture & Temples', icon: Landmark },
  { id: 'food', label: 'Food & Dining', icon: Utensils },
  { id: 'nature', label: 'Nature & Scenery', icon: Trees },
  { id: 'photography', label: 'Sightseeing', icon: Camera },
  { id: 'relaxation', label: 'Relaxation', icon: Palmtree },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'nightlife', label: 'Nightlife', icon: Wine },
  { id: 'adventure', label: 'Day Trips', icon: Compass },
];

const PRESETS = [
  {
    title: "Tokyo Highlights & Food",
    destination: "Tokyo",
    departure_city: "Los Angeles",
    duration_days: 5,
    num_travelers: 2,
    traveler_type: "couple",
    budget: 3200,
    interests: ["food", "culture", "photography"],
    trip_pace: "moderate",
    notes: "Love authentic ramen, sushi, and walking historic districts."
  },
  {
    title: "Paris Romantic Getaway",
    destination: "Paris",
    departure_city: "New York",
    duration_days: 4,
    num_travelers: 2,
    traveler_type: "couple",
    budget: 2800,
    interests: ["culture", "food", "relaxation"],
    trip_pace: "relaxed",
    notes: "Boutique hotel in Saint-Germain and Louvre guided tour."
  },
  {
    title: "Rome Heritage & Pasta",
    destination: "Rome",
    departure_city: "New York",
    duration_days: 5,
    num_travelers: 2,
    traveler_type: "couple",
    budget: 2900,
    interests: ["culture", "food", "photography"],
    trip_pace: "moderate",
    notes: "Colosseum, Vatican early morning, and local trattorias."
  },
  {
    title: "Bali Tropical Retreat",
    destination: "Bali",
    departure_city: "San Francisco",
    duration_days: 7,
    num_travelers: 2,
    traveler_type: "couple",
    budget: 2400,
    interests: ["nature", "relaxation", "culture"],
    trip_pace: "relaxed",
    notes: "Ubud rainforest villas and sunset beach dining."
  }
];

export default function TripPlannerView() {
  const { formData, setFormData, startPlanning, applyPreset } = useTravel();

  const handleInterestToggle = (id) => {
    setFormData(prev => {
      const exists = prev.interests.includes(id);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== id)
          : [...prev.interests, id]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startPlanning();
  };

  const perPersonTotal = Math.round(formData.budget / Math.max(1, formData.num_travelers));
  const perDayTotal = Math.round(formData.budget / Math.max(1, formData.duration_days));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Plan a New Trip
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Customize your destination, departure city, travel style, and budget preferences.
        </p>
      </div>

      {/* Preset Quick Fill Bar */}
      <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-blue-600" />
            Quick Templates
          </span>
          <span className="text-slate-400">Click any card to auto-fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-700">
                <span>{p.destination}</span>
                <span className="text-[11px] font-mono font-medium text-slate-600">
                  ${p.budget}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.title}</p>
              <div className="text-[10px] text-slate-400 mt-1">
                {p.duration_days} Days • {p.num_travelers} Travelers
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Where & When */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            Destination & Departure
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destination City
              </label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                required
              >
                <option value="Tokyo">Tokyo, Japan</option>
                <option value="Paris">Paris, France</option>
                <option value="Rome">Rome, Italy</option>
                <option value="Bali">Bali, Indonesia</option>
                <option value="New York">New York, USA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Departing From
              </label>
              <input
                type="text"
                value={formData.departure_city}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_city: e.target.value }))}
                placeholder="e.g. Los Angeles, Chicago"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approximate Date
              </label>
              <input
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData(prev => ({ ...prev, departure_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Duration & Travelers */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-4 h-4 text-blue-600" />
            Duration & Travel Party
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Trip Length</label>
                <span className="text-xs font-bold text-blue-600">{formData.duration_days} Days</span>
              </div>
              <input
                type="range"
                min="2"
                max="14"
                step="1"
                value={formData.duration_days}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_days: Number(e.target.value) }))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Weekend (2d)</span>
                <span>Week (7d)</span>
                <span>2 Weeks (14d)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Travelers</label>
                <span className="text-xs font-bold text-blue-600">
                  {formData.num_travelers} {formData.num_travelers === 1 ? 'Person' : 'People'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={formData.num_travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, num_travelers: Number(e.target.value) }))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Solo (1)</span>
                <span>Couple (2)</span>
                <span>Group (8)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Traveler Profile
              </label>
              <select
                value={formData.traveler_type}
                onChange={(e) => setFormData(prev => ({ ...prev, traveler_type: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="couple">Couple</option>
                <option value="solo">Solo Traveler</option>
                <option value="family">Family with Children</option>
                <option value="friends">Friends Group</option>
                <option value="budget">Budget Backpacker</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Budget */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Total Budget
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>~${perPersonTotal}/person</span>
              <span>•</span>
              <span>~${perDayTotal}/day</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Slide to select total estimated budget</span>
              <span className="text-base font-bold text-emerald-600 font-mono">
                ${formData.budget.toLocaleString()} USD
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="10000"
              step="100"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>$800</span>
              <span>$3,000</span>
              <span>$6,000</span>
              <span>$10,000+</span>
            </div>
          </div>
        </div>

        {/* Section 4: Style & Interests */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Compass className="w-4 h-4 text-blue-600" />
            Interests & Pace
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Trip Pace
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'relaxed', label: 'Relaxed', desc: '2 stops/day' },
                { id: 'moderate', label: 'Balanced', desc: '3 stops/day' },
                { id: 'packed', label: 'Active', desc: '4 stops/day' },
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, trip_pace: p.id }))}
                  className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                    formData.trip_pace === p.id
                      ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">{p.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Things You Enjoy
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_INTERESTS.map(item => {
                const isSelected = formData.interests.includes(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInterestToggle(item.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Specific Requests or Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Near metro stations, interested in cooking classes, need vegetarian dining..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Generate Itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
