'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  overview: {
    totalSessions: number;
    uniqueVisitors: number;
    returningVisitors: number;
    avgDuration: number;
    totalRevenue: number;
    avgOrderValue: number;
    conversionRate: number;
    ordersCompleted: number;
  };
  devices: { mobile: number; desktop: number; tablet: number };
  topReferrers: { source: string; count: number }[];
  funnel: {
    visited: number;
    started_wizard: number;
    selected_event: number;
    set_headcount: number;
    added_items: number;
    reached_checkout: number;
    completed_order: number;
  };
  topEvents: { name: string; count: number }[];
  popularProducts: { title: string; count: number }[];
  recentOrders: { order_number: string; headcount: number; order_total: string; is_quote: boolean; event_type: string; created_at: string }[];
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-wider mb-6">Analytics</h1>

        {/* Date Range */}
        <div className="flex gap-2 mb-6">
          {[1, 7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                days === d ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d === 1 ? 'Today' : `${d} Days`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading analytics...</div>
        ) : !data ? (
          <div className="text-center py-20 text-gray-400">{error || 'No data available'}</div>
        ) : (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Visitors', value: data.overview.uniqueVisitors.toString(), sub: `${data.overview.totalSessions} sessions` },
                { label: 'Returning', value: data.overview.returningVisitors.toString(), sub: `${data.overview.totalSessions > 0 ? Math.round((data.overview.returningVisitors / data.overview.totalSessions) * 100) : 0}% return rate` },
                { label: 'Avg Duration', value: formatDuration(data.overview.avgDuration), sub: 'per session' },
                { label: 'Conversion', value: `${data.overview.conversionRate}%`, sub: `${data.overview.ordersCompleted} orders` },
                { label: 'Revenue', value: formatCurrency(data.overview.totalRevenue), sub: `${days === 1 ? 'today' : `last ${days} days`}` },
                { label: 'Avg Order', value: formatCurrency(data.overview.avgOrderValue), sub: 'per order' },
                { label: 'Mobile', value: `${data.devices.mobile}`, sub: `${data.overview.totalSessions > 0 ? Math.round((data.devices.mobile / data.overview.totalSessions) * 100) : 0}%` },
                { label: 'Desktop', value: `${data.devices.desktop}`, sub: `${data.overview.totalSessions > 0 ? Math.round((data.devices.desktop / data.overview.totalSessions) * 100) : 0}%` },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 tracking-wider uppercase">{card.label}</p>
                  <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 tracking-wider">CONVERSION FUNNEL</h2>
              <div className="space-y-3">
                {[
                  { label: 'Visited Site', count: data.funnel.visited },
                  { label: 'Started Wizard', count: data.funnel.started_wizard },
                  { label: 'Selected Event Type', count: data.funnel.selected_event },
                  { label: 'Set Headcount', count: data.funnel.set_headcount },
                  { label: 'Added Items', count: data.funnel.added_items },
                  { label: 'Reached Checkout', count: data.funnel.reached_checkout },
                  { label: 'Completed Order', count: data.funnel.completed_order },
                ].map(step => {
                  const pct = data.funnel.visited > 0 ? (step.count / data.funnel.visited) * 100 : 0;
                  return (
                    <div key={step.label} className="flex items-center gap-4">
                      <div className="w-40 text-sm text-[#1A1A1A] font-medium">{step.label}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-[#E88A00] h-full rounded-full transition-all"
                          style={{ width: `${Math.max(pct, 1)}%` }}
                        />
                      </div>
                      <div className="w-20 text-right text-sm text-gray-600">
                        {step.count} <span className="text-gray-400">({Math.round(pct)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Popular Products */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 tracking-wider">POPULAR ITEMS</h2>
                {data.popularProducts.length === 0 ? (
                  <p className="text-sm text-gray-400">No cart activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.popularProducts.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-[#1A1A1A]">{p.title}</span>
                        <span className="font-bold text-[#E88A00]">{p.count} adds</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Referrers */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 tracking-wider">TRAFFIC SOURCES</h2>
                {data.topReferrers.length === 0 ? (
                  <p className="text-sm text-gray-400">No traffic data yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.topReferrers.map((r, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-[#1A1A1A] truncate max-w-[70%]">{r.source}</span>
                        <span className="font-bold text-gray-600">{r.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Events */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 tracking-wider">TOP EVENTS</h2>
                {data.topEvents.length === 0 ? (
                  <p className="text-sm text-gray-400">No events tracked yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.topEvents.map((e, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-[#1A1A1A] font-mono text-xs">{e.name}</span>
                        <span className="font-bold text-gray-600">{e.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 tracking-wider">RECENT ORDERS</h2>
                {data.recentOrders.length === 0 ? (
                  <p className="text-sm text-gray-400">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {data.recentOrders.map((o, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-[#1A1A1A] font-medium">{o.order_number}</span>
                          <span className="text-gray-400 text-xs ml-2">{o.headcount} guests</span>
                          {o.is_quote && <span className="text-xs text-amber-600 ml-1">(quote)</span>}
                        </div>
                        <span className="font-bold text-[#E88A00]">{formatCurrency(parseFloat(o.order_total))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
