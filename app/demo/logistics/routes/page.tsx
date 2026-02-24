'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  BarChart, Bar, Cell,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import {
  ArrowLeft, ChevronUp, ChevronDown, Minus,
  CheckCircle2, AlertTriangle,
  ArrowUpRight, ArrowDownRight,
  MapPin, Truck
} from 'lucide-react';

// ── DATA ──────────────────────────────────────────────────────────────────────

const ROUTES = [
  {
    id: "R-01", name: "NYC → Boston",     region: "Northeast", miles: 215, avgTransit: 4.2,
    onTime: 97.1, costPerMile: 2.84, volume: 342, change: +1.2,
    weeklyOnTime: [95.2, 96.1, 96.8, 97.4, 96.9, 97.2, 97.8, 97.1],
  },
  {
    id: "R-02", name: "LA → San Diego",   region: "West",      miles: 120, avgTransit: 2.1,
    onTime: 98.4, costPerMile: 2.61, volume: 289, change: +0.3,
    weeklyOnTime: [97.6, 97.9, 98.2, 98.5, 98.0, 98.4, 98.7, 98.4],
  },
  {
    id: "R-03", name: "Chicago → Detroit",region: "Midwest",   miles: 281, avgTransit: 5.8,
    onTime: 93.2, costPerMile: 3.12, volume: 218, change: -2.1,
    weeklyOnTime: [95.8, 95.1, 94.2, 93.7, 94.0, 93.5, 92.8, 93.2],
  },
  {
    id: "R-04", name: "Houston → Dallas", region: "South",     miles: 239, avgTransit: 4.5,
    onTime: 95.7, costPerMile: 2.95, volume: 275, change: +0.8,
    weeklyOnTime: [94.1, 94.6, 95.0, 95.3, 95.8, 95.5, 96.0, 95.7],
  },
  {
    id: "R-05", name: "Miami → Orlando",  region: "Southeast", miles: 235, avgTransit: 4.1,
    onTime: 91.8, costPerMile: 3.28, volume: 196, change: -1.5,
    weeklyOnTime: [93.5, 92.9, 92.1, 91.8, 92.4, 91.5, 91.1, 91.8],
  },
  {
    id: "R-06", name: "Seattle → Portland", region: "NW",      miles: 174, avgTransit: 3.2,
    onTime: 96.3, costPerMile: 2.77, volume: 231, change: +2.1,
    weeklyOnTime: [93.8, 94.3, 95.0, 95.6, 95.9, 96.1, 96.4, 96.3],
  },
  {
    id: "R-07", name: "Atlanta → Charlotte", region: "SE",     miles: 245, avgTransit: 4.8,
    onTime: 88.9, costPerMile: 3.41, volume: 178, change: -3.2,
    weeklyOnTime: [92.4, 91.6, 90.8, 90.1, 89.5, 89.1, 88.5, 88.9],
  },
  {
    id: "R-08", name: "Denver → SLC",    region: "Mountain",  miles: 371, avgTransit: 7.2,
    onTime: 92.5, costPerMile: 3.05, volume: 143, change: -0.8,
    weeklyOnTime: [93.2, 93.0, 92.6, 92.1, 92.8, 92.3, 91.9, 92.5],
  },
];

const WEEKS = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'];

type SortKey = 'onTime' | 'costPerMile' | 'volume';
type FilterKey = 'all' | 'ontrack' | 'atrisk';

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

export default function RoutesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Route Analytics…</div>}>
      <RoutesContent />
    </Suspense>
  );
}

// ── PAGE CONTENT ──────────────────────────────────────────────────────────────

function RoutesContent() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || 'Your Company';
  const companyParam = companyName !== 'Your Company'
    ? `?company=${encodeURIComponent(companyName)}`
    : '';

  const [sortBy,  setSortBy]   = useState<SortKey>('onTime');
  const [sortDir, setSortDir]  = useState<'asc' | 'desc'>('desc');
  const [filter,  setFilter]   = useState<FilterKey>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  }

  const filteredRoutes = useMemo(() => {
    let routes = [...ROUTES];
    if (filter === 'ontrack') routes = routes.filter(r => r.onTime >= 93);
    if (filter === 'atrisk')  routes = routes.filter(r => r.onTime < 93);
    routes.sort((a, b) => {
      const mult = sortDir === 'desc' ? -1 : 1;
      return mult * (a[sortBy] - b[sortBy]);
    });
    return routes;
  }, [sortBy, sortDir, filter]);

  // Bar chart: on-time % per route, sorted by on-time desc
  const barData = [...ROUTES]
    .sort((a, b) => b.onTime - a.onTime)
    .map(r => ({
      name: r.name.split(' → ')[0],
      onTime: r.onTime,
    }));

  // Weekly trend line chart: top 2 + bottom 2 routes
  const weeklyData = WEEKS.map((week, i) => ({
    week,
    'NYC→BOS': ROUTES[0].weeklyOnTime[i],
    'LA→SAN':  ROUTES[1].weeklyOnTime[i],
    'HOU→DAL': ROUTES[3].weeklyOnTime[i],
    'ATL→CLT': ROUTES[6].weeklyOnTime[i],
  }));

  const networkAvg = (ROUTES.reduce((s, r) => s + r.onTime, 0) / ROUTES.length).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-purple-100">

      {/* NAV */}
      <nav className="bg-[#4f158a] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
              <Image src="/logo.png" alt="DataStaq AI Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              DataStaq<span className="opacity-80">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/demo/logistics${companyParam}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-purple-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Logistics Overview
            </Link>
            <div className="h-6 w-[1px] bg-purple-500/50" />
            <span className="text-sm font-medium text-purple-100">
              Demo: <span className="text-white font-bold">{companyName}</span>
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm">
              <Link
                href={`/demo/logistics${companyParam}`}
                className="text-slate-400 hover:text-purple-600 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Logistics Overview
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-semibold">Route Analytics</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Route Analytics</h1>
            <p className="text-slate-500 text-lg mt-1">
              Performance breakdown across{' '}
              <span className="text-slate-900 font-semibold">{ROUTES.length} active lanes</span>
            </p>
          </div>
          <div className="flex gap-6">
            <SummaryPill label="Network Avg On-Time" value={`${networkAvg}%`} />
            <SummaryPill label="On Track" value={`${ROUTES.filter(r => r.onTime >= 93).length} routes`} green />
            <SummaryPill label="At Risk"  value={`${ROUTES.filter(r => r.onTime < 93).length} routes`} red />
          </div>
        </header>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Horizontal bar: on-time by route */}
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1">On-Time % by Route</h3>
            <p className="text-xs text-slate-400 mb-6">Last 30 days · colour = performance tier</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis
                    type="number"
                    domain={[82, 100]}
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={v => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    width={65}
                  />
                  <Tooltip
                    formatter={(v: any) => [`${v}%`, 'On-Time Rate']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <ReferenceLine x={93} stroke="#9333ea" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <Bar dataKey="onTime" radius={[0, 6, 6, 0]} barSize={22}>
                    {barData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={
                          entry.onTime >= 96 ? '#22c55e' :
                          entry.onTime >= 93 ? '#9333ea' :
                          entry.onTime >= 90 ? '#f59e0b' :
                                              '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {[
                { color: 'bg-emerald-500', label: '≥ 96% — Excellent' },
                { color: 'bg-purple-600',  label: '93–96% — On Target' },
                { color: 'bg-amber-500',   label: '90–93% — Watch' },
                { color: 'bg-red-500',     label: '< 90% — At Risk' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Line chart: 8-week weekly trend */}
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1">8-Week On-Time Trend</h3>
            <p className="text-xs text-slate-400 mb-6">Top 2 performers &amp; bottom 2 — weekly averages</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="week"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis
                    domain={[85, 100]}
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(v: any, name: any) => [`${v}%`, name]}
                  />
                  <ReferenceLine y={93} stroke="#9333ea" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <Legend verticalAlign="bottom" height={40} />
                  <Line type="linear" dataKey="NYC→BOS" stroke="#9333ea" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="linear" dataKey="LA→SAN"  stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="linear" dataKey="HOU→DAL" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="linear" dataKey="ATL→CLT" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 3" activeDot={{ r: 4, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROUTE TABLE */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">

          {/* Controls */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-wrap gap-4">
            <h3 className="text-xl font-bold text-slate-900">All Routes</h3>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'ontrack', 'atrisk'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filter === f
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all'     && 'All Routes'}
                  {f === 'ontrack' && <><CheckCircle2 className="w-3 h-3" />On Track</>}
                  {f === 'atrisk'  && <><AlertTriangle className="w-3 h-3" />At Risk</>}
                </button>
              ))}
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Route</div>
            <SortHeader label="On-Time %"  sortKey="onTime"      current={sortBy} dir={sortDir} onSort={handleSort} />
            <SortHeader label="$ / Mile"   sortKey="costPerMile" current={sortBy} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Volume"     sortKey="volume"      current={sortBy} dir={sortDir} onSort={handleSort} />
            <div className="col-span-2">4-Wk Change</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50">
            {filteredRoutes.map(route => (
              <div key={route.id}>
                <div
                  onClick={() => setExpanded(expanded === route.id ? null : route.id)}
                  className={`grid grid-cols-12 gap-2 px-6 py-4 cursor-pointer transition-colors items-center ${
                    expanded === route.id ? 'bg-purple-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
                      route.onTime >= 96 ? 'bg-emerald-500' :
                      route.onTime >= 93 ? 'bg-purple-500' :
                      route.onTime >= 90 ? 'bg-amber-500'  :
                                          'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{route.name}</div>
                      <div className="text-xs text-slate-400">{route.region} · {route.miles} mi</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-sm font-bold ${
                      route.onTime >= 96 ? 'text-emerald-600' :
                      route.onTime >= 93 ? 'text-slate-800'   :
                      route.onTime >= 90 ? 'text-amber-600'   :
                                          'text-rose-600'
                    }`}>
                      {route.onTime}%
                    </span>
                  </div>
                  <div className="col-span-2 text-sm font-medium text-slate-700">${route.costPerMile.toFixed(2)}</div>
                  <div className="col-span-2 text-sm font-medium text-slate-700">{route.volume.toLocaleString()}</div>
                  <div className={`col-span-2 flex items-center gap-1 text-xs font-bold ${
                    route.change > 0 ? 'text-emerald-600' : route.change < 0 ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    {route.change > 0
                      ? <ArrowUpRight className="w-3.5 h-3.5" />
                      : route.change < 0
                      ? <ArrowDownRight className="w-3.5 h-3.5" />
                      : <Minus className="w-3.5 h-3.5" />
                    }
                    {route.change > 0 ? '+' : ''}{route.change}%
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === route.id && (
                  <div className="px-6 pb-5">
                    <div className="bg-white border border-purple-100 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-5 gap-4">
                      <DetailCell label="Avg Transit"    value={`${route.avgTransit} hrs`} />
                      <DetailCell label="Avg Trip Cost"  value={`$${(route.miles * route.costPerMile).toFixed(0)}`} />
                      <DetailCell label="Cost Efficiency" value={
                        route.costPerMile <= 2.80 ? 'Excellent' :
                        route.costPerMile <= 3.10 ? 'Good' : 'Review'
                      } />
                      <DetailCell label="Weekly Volume"  value={`~${Math.round(route.volume / 4)}/wk`} />
                      <DetailCell label="Status" value={route.onTime >= 93 ? '✅ On Track' : '⚠️ At Risk'} />
                    </div>

                    {/* Mini sparkline for this route */}
                    <div className="mt-4 h-[90px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={WEEKS.map((w, i) => ({ week: w, pct: route.weeklyOnTime[i] }))}
                          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                        >
                          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                          <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} tickFormatter={v => `${v}%`} width={35} />
                          <Tooltip
                            formatter={(v: any) => [`${v}%`, 'On-Time']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                          />
                          <Line
                            type="linear"
                            dataKey="pct"
                            stroke={route.onTime >= 93 ? '#9333ea' : '#ef4444'}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="pb-16 flex justify-center">
          <Link
            href={`/demo/logistics${companyParam}`}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Logistics Overview
          </Link>
        </div>

      </main>
    </div>
  );
}

// ── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function SortHeader({ label, sortKey, current, dir, onSort }: {
  label: string; sortKey: SortKey; current: SortKey; dir: 'asc' | 'desc'; onSort: (k: SortKey) => void;
}) {
  const isActive = current === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`col-span-2 flex items-center gap-1 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
        isActive ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
      {isActive
        ? dir === 'desc'
          ? <ChevronDown className="w-3 h-3" />
          : <ChevronUp className="w-3 h-3" />
        : <Minus className="w-3 h-3 opacity-30" />
      }
    </button>
  );
}

function SummaryPill({ label, value, green, red }: { label: string; value: string; green?: boolean; red?: boolean }) {
  return (
    <div className="text-right md:text-left">
      <div className={`text-2xl font-black ${green ? 'text-emerald-600' : red ? 'text-rose-600' : 'text-slate-900'}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</div>
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}
