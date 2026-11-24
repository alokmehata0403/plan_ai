import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Plane, 
  Hotel, 
  Utensils, 
  Compass, 
  Train, 
  Shield,
  ArrowRight,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useTravel } from '../context/TravelContext';

export default function BudgetDashboardView() {
  const { currentPlan, setCurrentView, setIsChatOpen, handleSendMessage } = useTravel();

  if (!currentPlan?.budget) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Budget Data</h2>
        <p className="text-slate-500 text-sm">
          Please generate a trip plan first to inspect the automated budget breakdown.
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

  const { budget, destination, duration_days, num_travelers, target_budget } = currentPlan;
  const items = budget.items || [];
  const grandTotal = budget.grand_total || target_budget;
  const remaining = budget.remaining_budget || 0;
  const isUnder = remaining >= 0;

  // Refined natural colors
  const cleanColors = ['#2563eb', '#3b82f6', '#059669', '#d97706', '#64748b', '#94a3b8'];

  const chartData = items.map((item, idx) => ({
    name: item.category,
    amount: item.amount,
    percentage: item.percentage,
    color: cleanColors[idx % cleanColors.length]
  }));

  const comparisonData = [
    {
      name: 'Budget vs Actual',
      Target: target_budget,
      Calculated: grandTotal
    }
  ];

  const categoryIcons = {
    Flights: Plane,
    'Hotels & Stays': Hotel,
    'Food & Dining': Utensils,
    'Activities & Tours': Compass,
    'Local Transit': Train,
    'Buffer / Contingency': Shield
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Financial Breakdown
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            {destination} Expense Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculated across {num_travelers} traveler(s) for {duration_days} days.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isUnder ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>${remaining.toLocaleString()} Buffer Remaining</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>${Math.abs(remaining).toLocaleString()} Over Target</span>
            </div>
          )}
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Target Budget</span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
            ${target_budget?.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Configured</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Estimated Total</span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
            ${grandTotal?.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">All components</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Cost Per Person</span>
          <div className="text-xl sm:text-2xl font-bold text-blue-600 font-mono mt-1">
            ${budget.per_person_total?.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">For {num_travelers} travelers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Daily Average</span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
            ${Math.round(grandTotal / duration_days).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Per day</span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-blue-600" />
              Category Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Estimated percentage of budget per category
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-xs">
            {chartData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 truncate">{entry.name}:</span>
                <span className="font-semibold text-slate-900 font-mono">{entry.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Target vs Calculated Total
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing your initial target budget with estimated expenditure
            </p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Calculated" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            {isUnder 
              ? `Estimated trip cost is within your $${target_budget.toLocaleString()} target with a healthy buffer.`
              : `Estimated trip cost slightly exceeds target; consider 1-stop flights or 3-star boutique hotels to save.`}
          </div>
        </div>

      </div>

      {/* Itemized Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-blue-600" />
          Itemized Category Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, idx) => {
            const Icon = categoryIcons[item.category] || DollarSign;
            return (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">{item.category}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">{item.percentage}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    ${item.amount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    ${Math.round(item.amount / num_travelers).toLocaleString()} / person
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Advice */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Want to adjust or optimize your expenses?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask our travel assistant to find alternative hotels, flight connections, or budget-friendly activities.
          </p>
        </div>

        <button
          onClick={() => {
            setIsChatOpen(true);
            handleSendMessage(`Can you suggest 3 specific ways to save money on this ${destination} trip?`);
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Ask Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
