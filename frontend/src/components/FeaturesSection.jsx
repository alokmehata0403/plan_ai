import React from 'react';
import { Compass, ShieldCheck, PieChart, Clock, Sparkles, Map } from 'lucide-react';

export default function FeaturesSection() {
  const benefits = [
    {
      icon: Map,
      title: "Optimized Daily Schedules",
      desc: "Activities grouped by neighborhood to prevent exhausting cross-city travel. Balanced timing with time for meals and leisure."
    },
    {
      icon: Compass,
      title: "Curated Flights & Hotels",
      desc: "Direct flight options matched with hotels in safe, walkable neighborhoods tailored to your travel party (solo, couple, or family)."
    },
    {
      icon: PieChart,
      title: "Real Budget Feasibility",
      desc: "Clear itemization for airfare, hotel nights, daily dining, and activities so you know your estimated trip spend upfront."
    },
    {
      icon: Clock,
      title: "Interactive Modifications",
      desc: "Ask our travel assistant to modify days, suggest cheaper stays, add specific attractions, or customize food preferences."
    }
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How PlanAI Builds Your Journey
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Instead of generic travel advice, our specialized agent system coordinates real flight data, accommodations, attractions, and budgets into one unified plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
