'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database,
  BrainCircuit,
  Cpu,
  Server,
  LineChart,
  CreditCard,
  Users,
  BarChart3
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Card = ({
  title,
  icon: Icon,
  color,
  isActive,
  onClick,
  isCenter = false,
  isDest = false,
}: any) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative z-20 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 w-32 h-32 md:w-40 md:h-40 backdrop-blur-xl',
        isActive
          ? `bg-${color}-500/10 border-${color}-500/50 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-${color}-500/30`
          : 'bg-slate-800/40 border-slate-700 hover:border-slate-500',
        isCenter && 'w-48 h-48 md:w-56 md:h-56 border-indigo-500/30 bg-indigo-950/20',
        isDest && 'aspect-square'
      )}
    >
      {/* ICON — ALWAYS VISIBLE */}
      <div
        className={cn(
          'p-3 rounded-xl flex items-center justify-center',
          `bg-${color}-500/20 text-${color}-400`,
          'opacity-100 grayscale-0',
          isCenter && 'bg-indigo-600/20 text-indigo-300 p-5 rounded-2xl'
        )}
      >
        <Icon
          className={cn('w-6 h-6 shrink-0', isCenter && 'w-10 h-10')}
          strokeWidth={2.5}
        />
      </div>

      <span
        className={cn(
          'font-bold text-sm tracking-tight transition-opacity duration-300',
          isActive ? 'text-white' : 'text-slate-400',
          isCenter && 'text-lg text-indigo-100'
        )}
      >
        {title}
      </span>

      {isActive && (
        <motion.div
          layoutId="active-ring"
          className={cn(
            'absolute inset-0 rounded-2xl border-2 opacity-50',
            `border-${color}-500`
          )}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const ConnectionLine = ({
  active,
  color,
  verticalOffset = 0,
}: {
  active: boolean;
  color: string;
  verticalOffset?: number;
}) => {
  const gradientId = `gradient-${color}-${verticalOffset}`;

  return (
    <div
      className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none overflow-hidden z-10"
      style={{ transform: `translateY(${verticalOffset}px)` }}
    >
      <svg className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <path
          d="M0,48 C100,48 100,48 200,48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-800"
          vectorEffect="non-scaling-stroke"
        />

        {active && (
          <>
            <motion.path
              d="M0,48 C100,48 100,48 200,48"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              className={cn(`text-${color}-500`)}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />

            <motion.circle
              r="4"
              fill="currentColor"
              className={cn(
                `text-${color}-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`
              )}
            >
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                path="M0,48 C100,48 100,48 200,48"
              />
            </motion.circle>
          </>
        )}
      </svg>
    </div>
  );
};

export default function DataFlowDiagram() {
  const [activeSource, setActiveSource] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSource((prev) => (prev === null || prev === 3 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sources = [
    { id: 0, title: 'CRM', icon: Users, color: 'orange' },
    { id: 1, title: 'Product Analytics', icon: LineChart, color: 'emerald' },
    { id: 2, title: 'Payment Processor', icon: CreditCard, color: 'violet' },
    { id: 3, title: 'Internal DB', icon: Database, color: 'blue' },
  ];

  const destinations = [
    { id: 'ai', title: 'AI Systems', icon: Cpu, color: 'fuchsia' },
    { id: 'dash', title: 'Dashboards', icon: BarChart3, color: 'indigo' },
  ];

  return (
    <div className="w-full py-20 bg-[#0f0518] relative overflow-hidden rounded-3xl border border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
          {/* SOURCES */}
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 text-center md:text-left">
              Data Sources
            </h3>
            {sources.map((source, index) => (
              <div key={source.id} className="relative group flex items-center">
                <Card
                  {...source}
                  isActive={activeSource === index}
                  onClick={() => setActiveSource(index)}
                />
                <div className="hidden md:block absolute left-full top-1/2 w-24 lg:w-32 h-1 -translate-y-1/2 z-0">
                  <ConnectionLine
                    active={activeSource === index}
                    color={source.color}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CORE */}
          <div className="relative flex flex-col items-center justify-center mx-12">
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 20px -5px rgba(79, 70, 229, 0.3)',
                  '0 0 50px -10px rgba(79, 70, 229, 0.6)',
                  '0 0 20px -5px rgba(79, 70, 229, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Card
                title="DataStaq Core"
                icon={Server}
                color="indigo"
                isActive={true}
                isCenter={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-12 text-center w-full whitespace-nowrap"
            >
              <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                Syncing {sources[activeSource || 0].title} Stream...
              </div>
            </motion.div>
          </div>

          {/* DESTINATIONS */}
          <div className="flex flex-col gap-8 w-full md:w-auto relative">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 text-center md:text-right">
              Action Layer
            </h3>
            {destinations.map((dest) => (
              <div key={dest.id} className="relative flex items-center">
                <div className="hidden md:block absolute right-full top-1/2 w-24 lg:w-32 h-1 -translate-y-1/2 z-0">
                  <ConnectionLine active={true} color={dest.color} />
                </div>
                <Card {...dest} isActive={true} isDest={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
