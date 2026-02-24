'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  LineChart, Line,
  ComposedChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import {
  Truck, Package, AlertTriangle, X, RefreshCw,
  Download, ChevronRight, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Minus,
  Map, TrendingDown, Thermometer, Navigation
} from 'lucide-react';

// ── DATA ──────────────────────────────────────────────────────────────────────

const DAILY_DATA = [
  { date: "1/26", onTime: 91.2, volume: 412, cost: 41.20, fuel: 7.8 },
  { date: "1/27", onTime: 89.4, volume: 398, cost: 42.10, fuel: 7.6 },
  { date: "1/28", onTime: 88.1, volume: 375, cost: 43.50, fuel: 7.9 },
  { date: "1/29", onTime: 86.7, volume: 340, cost: 44.20, fuel: 8.1 },
  { date: "1/30", onTime: 92.3, volume: 445, cost: 40.80, fuel: 7.7 },
  { date: "1/31", onTime: 93.1, volume: 461, cost: 39.90, fuel: 7.5 },
  { date: "2/1",  onTime: 91.8, volume: 438, cost: 40.50, fuel: 7.6 },
  { date: "2/2",  onTime: 90.5, volume: 422, cost: 41.30, fuel: 7.7 },
  { date: "2/3",  onTime: 92.7, volume: 456, cost: 39.70, fuel: 7.4 },
  { date: "2/4",  onTime: 87.9, volume: 380, cost: 42.80, fuel: 7.8 },
  { date: "2/5",  onTime: 85.3, volume: 355, cost: 44.60, fuel: 8.0 },
  { date: "2/6",  onTime: 93.4, volume: 468, cost: 39.20, fuel: 7.4 },
  { date: "2/7",  onTime: 94.1, volume: 475, cost: 38.90, fuel: 7.3 },
  { date: "2/8",  onTime: 92.8, volume: 452, cost: 40.10, fuel: 7.5 },
  { date: "2/9",  onTime: 91.5, volume: 441, cost: 40.70, fuel: 7.6 },
  { date: "2/10", onTime: 94.6, volume: 482, cost: 38.40, fuel: 7.2 },
  { date: "2/11", onTime: 89.2, volume: 395, cost: 41.90, fuel: 7.8 },
  { date: "2/12", onTime: 87.4, volume: 362, cost: 43.20, fuel: 8.0 },
  { date: "2/13", onTime: 94.8, volume: 491, cost: 38.10, fuel: 7.2 },
  { date: "2/14", onTime: 95.1, volume: 510, cost: 37.60, fuel: 7.1 },
  { date: "2/15", onTime: 92.1, volume: 455, cost: 39.50, fuel: 7.5 },
  { date: "2/16", onTime: 95.2, volume: 498, cost: 37.80, fuel: 7.1 },
  { date: "2/17", onTime: 93.9, volume: 477, cost: 38.50, fuel: 7.3 },
  { date: "2/18", onTime: 90.3, volume: 408, cost: 41.10, fuel: 7.7 },
  { date: "2/19", onTime: 88.7, volume: 382, cost: 42.40, fuel: 7.9 },
  { date: "2/20", onTime: 95.6, volume: 503, cost: 37.40, fuel: 7.0 },
  { date: "2/21", onTime: 94.3, volume: 488, cost: 38.20, fuel: 7.2 },
  { date: "2/22", onTime: 93.7, volume: 472, cost: 38.70, fuel: 7.3 },
  { date: "2/23", onTime: 96.1, volume: 518, cost: 36.90, fuel: 6.9 },
  { date: "2/24", onTime: 94.8, volume: 495, cost: 37.60, fuel: 7.1 },
];

const FLEET = [
  { label: "Long-Haul", active: 24, total: 28, icon: Truck,       loadFactor: "81%", avgMpg: "7.1", idle: "9%"  },
  { label: "Local Delivery", active: 45, total: 52, icon: Package, loadFactor: "74%", avgMpg: "8.2", idle: "14%" },
  { label: "Refrigerated", active: 12, total: 15, icon: Thermometer, loadFactor: "88%", avgMpg: "6.8", idle: "7%"  },
  { label: "Last-Mile",  active: 38, total: 40, icon: Navigation,  loadFactor: "91%", avgMpg: "9.4", idle: "11%" },
];

const INITIAL_ALERTS = [
  { id: 1, level: "warn" as const, msg: "Weather delays detected on I-95 corridor — 3 routes affected. ETAs adjusted automatically." },
  { id: 2, level: "warn" as const, msg: "Route ATL→CLT on-time rate dropped to 88.9% this week. Review call scheduled Fri." },
  { id: 3, level: "info" as const, msg: "Planned maintenance for 4 long-haul vehicles this Sat–Sun. Capacity reduced ~8%." },
];

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

export default function LogisticsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Dashboard...</div>}>
      <LogisticsDashboard />
    </Suspense>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

function LogisticsDashboard() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || 'Your Company';

  const [range, setRange]             = useState<7 | 14 | 30>(30);
  const [activeChart, setActiveChart] = useState<'delivery' | 'volume' | 'fuel'>('delivery');
  const [alerts, setAlerts]           = useState(INITIAL_ALERTS);
  const [activeFleet, setActiveFleet] = useState<number | null>(null);
  const [refreshing, setRefreshing]   = useState(false);
  const [exporting, setExporting]     = useState(false);

  const chartData = useMemo(() => DAILY_DATA.slice(-range), [range]);

  const avgOnTime = useMemo(
    () => (chartData.reduce((s, d) => s + d.onTime, 0) / chartData.length).toFixed(1),
    [chartData]
  );
  const avgCost = useMemo(
    () => (chartData.reduce((s, d) => s + d.cost, 0) / chartData.length).toFixed(2),
    [chartData]
  );
  const totalVolume = useMemo(
    () => chartData.reduce((s, d) => s + d.volume, 0).toLocaleString(),
    [chartData]
  );

  const xInterval = range === 30 ? 4 : range === 14 ? 1 : 0;

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }
  function handleExport() {
    setExporting(true);
    setTimeout(() => setExporting(false), 2000);
  }

  const companyParam = companyName !== 'Your Company'
    ? `?company=${encodeURIComponent(companyName)}`
    : '';

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
              href={`/demo/logistics/routes${companyParam}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-purple-200 hover:text-white transition-colors"
            >
              <Map className="w-4 h-4" />
              Route Analytics
              <ChevronRight className="w-3.5 h-3.5" />
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
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Truck className="w-3 h-3" /> Logistics
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Logistics Command Center</h1>
            <p className="text-slate-500 text-lg mt-1">
              Solving for:{" "}
              <span className="text-slate-900 font-medium italic underline decoration-purple-400">
                Real-Time Fleet &amp; Delivery Visibility
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time range */}
            <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              {([7, 14, 30] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setRange(d)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    range === d
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting…' : 'Export CSV'}
            </button>

            <div className="flex gap-2">
              {['Samsara', 'SAP TM', 'FedEx'].map(tag => (
                <div key={tag} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
                  alert.level === 'warn'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${alert.level === 'warn' ? 'text-amber-500' : 'text-blue-500'}`} />
                  {alert.msg}
                </div>
                <button
                  onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard
            title="On-Time Delivery"
            metric={`${avgOnTime}%`}
            delta="+1.8%"
            deltaType="increase"
            subtext={`${range}-day average`}
            icon={Clock}
          />
          <KPICard
            title="Avg Cost / Shipment"
            metric={`$${avgCost}`}
            delta="-$2.10"
            deltaType="increase"
            subtext="vs. prior period"
            icon={TrendingDown}
          />
          <KPICard
            title="Total Shipments"
            metric={totalVolume}
            delta="+4.2%"
            deltaType="increase"
            subtext={`Last ${range} days`}
            icon={Package}
          />
          <KPICard
            title="Active Routes"
            metric="24"
            delta="+2"
            deltaType="increase"
            subtext="vs. last period"
            icon={Map}
          />
        </div>

        {/* CHART SECTION */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-xl font-bold text-slate-900">
              {activeChart === 'delivery' && 'On-Time Delivery Rate'}
              {activeChart === 'volume'   && 'Shipment Volume & Cost per Shipment'}
              {activeChart === 'fuel'     && 'Fleet Fuel Efficiency (MPG)'}
            </h3>
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {(['delivery', 'volume', 'fuel'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeChart === tab
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'delivery' ? 'Delivery %' : tab === 'volume' ? 'Volume & Cost' : 'Fuel'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'delivery' ? (
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    dy={10}
                    interval={xInterval}
                  />
                  <YAxis
                    domain={[83, 99]}
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={v => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v: any) => [`${v}%`, 'On-Time Rate']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <ReferenceLine
                    y={93}
                    stroke="#9333ea"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                    label={{ value: 'Target 93%', fill: '#9333ea', fontSize: 11, position: 'insideTopRight' }}
                  />
                  <Line
                    type="linear"
                    dataKey="onTime"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0, fill: '#9333ea' }}
                  />
                </LineChart>
              ) : activeChart === 'volume' ? (
                <ComposedChart data={chartData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    dy={10}
                    interval={xInterval}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={v => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar yAxisId="left" dataKey="volume" name="Shipments" fill="#e9d5ff" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="linear"
                    dataKey="cost"
                    name="Cost/Ship ($)"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0, fill: '#9333ea' }}
                  />
                </ComposedChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    dy={10}
                    interval={xInterval}
                  />
                  <YAxis
                    domain={[6.5, 8.5]}
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickFormatter={v => `${v}`}
                  />
                  <Tooltip
                    formatter={(v: any) => [`${v} mpg`, 'Fuel Efficiency']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <ReferenceLine
                    y={7.5}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                    label={{ value: 'Target 7.5', fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }}
                  />
                  <Line
                    type="linear"
                    dataKey="fuel"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0, fill: '#06b6d4' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* FLEET STATUS + PERFORMANCE SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Fleet Cards — 2/3 width */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Fleet Status</h3>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                119 / 135 Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FLEET.map((f, i) => {
                const Icon = f.icon;
                const pct = Math.round((f.active / f.total) * 100);
                const isActive = activeFleet === i;
                return (
                  <button
                    key={f.label}
                    onClick={() => setActiveFleet(isActive ? null : i)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      isActive
                        ? 'border-purple-400 bg-purple-50 shadow-lg shadow-purple-100'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-purple-100' : 'bg-slate-100'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-500'}`} />
                      </div>
                      <span className={`text-xs font-bold ${
                        pct >= 90 ? 'text-emerald-600' : pct >= 80 ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm mb-1">{f.label}</div>
                    <div className="text-xs text-slate-500">
                      {f.active} active · {f.total - f.active} in maintenance
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 90 ? 'bg-emerald-500' : pct >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {isActive && (
                      <div className="mt-4 pt-3 border-t border-purple-100 grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-800">{f.loadFactor}</div>
                          <div className="text-xs text-slate-400 mt-0.5">Load</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-800">{f.avgMpg}</div>
                          <div className="text-xs text-slate-400 mt-0.5">MPG</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-slate-800">{f.idle}</div>
                          <div className="text-xs text-slate-400 mt-0.5">Idle</div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Performance snapshot — 1/3 width */}
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 flex flex-col gap-5">
            <h3 className="text-xl font-bold text-slate-900">Performance</h3>
            <div className="space-y-4 flex-1">
              <StatRow label="Avg Delivery Time"  value="4.1 hrs"  sub="vs 4.5 hr target"    ok />
              <StatRow label="Fuel Cost / Mile"   value="$0.42"   sub="+$0.03 vs last mo."       />
              <StatRow label="Empty Miles %"      value="11.2%"   sub="−1.8 pts this period" ok />
              <StatRow label="Driver Utilization" value="91%"     sub="Above 85% target"     ok />
              <StatRow label="Claims Rate"        value="0.4%"    sub="0.2% below threshold" ok />
            </div>
            <Link
              href={`/demo/logistics/routes${companyParam}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200 group"
            >
              View Route Analytics
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* FOOTER CTA */}
        <footer className="pt-4 pb-20">
          <div className="bg-purple-900 rounded-[2.5rem] p-12 relative overflow-hidden text-center md:text-left">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-4">
                <h4 className="text-3xl font-bold text-white">Scale your logistics operations.</h4>
                <p className="text-purple-200 text-lg font-medium italic opacity-90 leading-relaxed">
                  "DataStaq connects Samsara, your TMS, and carrier APIs into one live ops center — no spreadsheets, no manual stitching."
                </p>
              </div>
              <button className="group flex items-center gap-3 bg-white text-purple-950 px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-purple-50 transition-all hover:scale-105">
                Build this for {companyName}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          </div>
        </footer>

      </main>
    </div>
  );
}

// ── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function KPICard({ title, metric, delta, deltaType, subtext, icon: Icon }: {
  title: string; metric: string; delta: string; deltaType: string; subtext: string; icon: React.ElementType;
}) {
  const isIncrease = deltaType.includes('increase');
  const isDecrease = deltaType.includes('decrease');
  const badgeStyles = isIncrease
    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
    : isDecrease
    ? 'bg-rose-50 text-rose-600 border-rose-100'
    : 'bg-slate-50 text-slate-500 border-slate-100';
  const DeltaIcon = isIncrease ? ArrowUpRight : isDecrease ? ArrowDownRight : Minus;

  return (
    <div className="group p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-slate-50">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-xs ${badgeStyles}`}>
          <DeltaIcon className="w-3 h-3" strokeWidth={3} />
          {delta}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-1">{metric}</h2>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
      <p className="text-xs text-slate-400">{subtext}</p>
    </div>
  );
}

function StatRow({ label, value, sub, ok }: { label: string; value: string; sub: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <div className="text-sm font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
      <div className={`text-xs font-semibold text-right ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>{sub}</div>
    </div>
  );
}
