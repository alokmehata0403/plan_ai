import React from 'react';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 tracking-tight">PlanAI Travel</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              An intelligent travel planning platform coordinating flights, stays, activities, and budgets tailored to you.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold text-xs mb-3">Popular Destinations</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Tokyo, Japan</li>
              <li>Paris, France</li>
              <li>Rome, Italy</li>
              <li>Bali, Indonesia</li>
              <li>New York, United States</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold text-xs mb-3">Trip Planning</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Flight Search</li>
              <li>Hotel Recommendations</li>
              <li>Custom Itineraries</li>
              <li>Budget Tracking</li>
              <li>Travel Preferences</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold text-xs mb-3">About</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              Powered by Python multi-agent system, LangChain, and real travel database integration.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All services active</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <p>© 2026 PlanAI Travel. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
