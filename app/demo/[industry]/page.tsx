'use client';

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image'; // Import for the PNG logo
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Minus, 
  CheckCircle2, Database, 
  ArrowRight
} from 'lucide-react';
import { icpData } from "../../data";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function DashboardContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const industryKey = params.industry as string;
  const data = icpData[industryKey] || icpData["pro-services"];
  const companyName = searchParams.get('company') || "Your Company";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-purple-100">
      
      {/* PURPLE Navigation Bar */}
      <nav className="bg-purple-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* PNG LOGO REPLACEMENT */}
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white p-1">
                <Image 
                    src="/logo.png" 
                    alt="DataStaq AI Logo" 
                    fill
                    className="object-contain"
                />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
                DataStaq<span className="opacity-80">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-purple-500/50 mx-2" />
            <span className="text-sm font-medium text-purple-100">
                Demo Instance: <span className="text-white font-bold">{companyName}</span>
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Database className="w-3 h-3" /> {industryKey.replace('-', ' ')}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{data.title}</h1>
            <p className="text-slate-500 text-lg">Solving for: <span className="text-slate-900 font-medium italic underline decoration-purple-400">{data.painPoint}</span></p>
          </div>
          
          <div className="flex gap-2">
            {data.integrations.map((item: string) => (
              <div key={item} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.kpis.map((kpi: any, i: number) => (
            <div key={i} className="group p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                <BadgeDelta type={kpi.deltaType} value={kpi.delta} />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-1">{kpi.metric}</h2>
              <p className="text-sm text-slate-500 font-medium">{kpi.subtext}</p>
            </div>
          ))}
        </div>

        {/* Main Chart Container */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">{data.chartTitle}</h3>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-white text-purple-600 rounded-lg shadow-sm">Live Trend</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Historical</button>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {industryKey === 'pe-portfolio' || industryKey === 'legal-ops' ? (
                <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  {Object.keys(data.chartData[0]).filter(k => k !== 'name').map((key, i) => (
                    <Bar key={key} dataKey={key} fill={i === 0 ? '#7e22ce' : '#a855f7'} radius={[6, 6, 0, 0]} barSize={40} />
                  ))}
                </BarChart>
              ) : (
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  {Object.keys(data.chartData[0]).filter(k => k !== 'name').map((key, i) => (
                    <Area key={key} type="monotone" dataKey={key} stroke={i === 0 ? '#9333ea' : '#c084fc'} strokeWidth={3} fillOpacity={1} fill="url(#colorMain)" />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer CTA */}
        <footer className="pt-10 pb-20">
          <div className="bg-purple-900 rounded-[2.5rem] p-12 relative overflow-hidden text-center md:text-left">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-4">
                <h4 className="text-3xl font-bold text-white">Scale your data operations.</h4>
                <p className="text-purple-200 text-lg font-medium italic opacity-90 leading-relaxed">
                  "Most agencies manually stitch these reports together every month. DataStaq connects your stack once and lets you focus on growth."
                </p>
              </div>
              <button className="group flex items-center gap-3 bg-white text-purple-950 px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-purple-50 transition-all hover:scale-105">
                Build this for {companyName}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          </div>
        </footer>

      </main>
    </div>
  );
}

function BadgeDelta({ type, value }: { type: string, value: string }) {
  const isIncrease = type.toLowerCase().includes('increase');
  const isDecrease = type.toLowerCase().includes('decrease');
  
  const styles = isIncrease 
    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
    : isDecrease 
      ? "bg-rose-50 text-rose-600 border-rose-100" 
      : "bg-slate-50 text-slate-500 border-slate-100";

  const Icon = isIncrease ? ArrowUpRight : isDecrease ? ArrowDownRight : Minus;

  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-xs ${styles}`}>
      <Icon className="w-3 h-3" strokeWidth={3} />
      {value}
    </div>
  );
}