'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  LayoutDashboard, 
  BrainCircuit, 
  Server, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  HardDrive 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility for cleaner classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons & Logos ---
const HubSpotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FF7A59]">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" opacity="0.2"/>
    <path d="M15.5 10a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 15.5 10Zm-3.5-3a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 7Zm-3.5 3a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 8.5 10Zm3.5 4a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 12 14Z"/>
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#95BF47]">
    <path d="M3.5 7.5l2-3L21 2l-1 18-9 4-8.5-3.5L3.5 7.5z" opacity="0.2"/>
    <path d="M12 16.5l-4-2V9l4 2 4-2v5.5l-4 2z"/>
  </svg>
);

const StripeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#635BFF]">
    <path d="M2 4h20v16H2z" opacity="0" />
    <path d="M13.9 11.5a2.5 2.5 0 0 0-2.2-1.3c-1.3 0-2 .6-2 1.6 0 .8.6 1.3 2.1 1.7 2.4.6 3.3 1.5 3.3 3.3 0 1.9-1.6 3.2-4.1 3.2-2 0-3.6-.8-4-2.5l2.2-.5c.2.9 1 1.4 1.9 1.4 1.2 0 1.9-.6 1.9-1.6 0-.9-.7-1.4-2.2-1.8-2.4-.6-3.2-1.6-3.2-3.2 0-1.8 1.5-3.1 3.8-3.1 1.9 0 3.2.7 3.6 2.3l-2.1.5z"/>
  </svg>
);

// --- Components ---

const Card = ({ title, icon: Icon, color, isActive, onClick, isCenter = false, isDest = false }: any) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative z-20 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 w-32 h-32 md:w-40 md:h-40 backdrop-blur-xl",
        isActive 
          ? `bg-${color}-500/10 border-${color}-500/50 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-${color}-500/30` 
          : "bg-slate-900/40 border-slate-700/50 hover:border-slate-500",
        isCenter && "w-48 h-48 md:w-56 md:h-56 border-indigo-500/30 bg-indigo-950/20",
        isDest && "rounded-full aspect-square"
      )}
    >
      <div className={cn(
        "p-3 rounded-xl transition-colors duration-300",
        isActive ? `bg-${color}-500/20 text-${color}-400` : "bg-slate-800 text-slate-400",
        isCenter && "bg-indigo-600/20 text-indigo-300 p-5 rounded-2xl"
      )}>
        <Icon className={cn("w-6 h-6", isCenter && "w-10 h-10")} />
      </div>
      <span className={cn(
        "font-bold text-sm tracking-tight",
        isActive ? "text-white" : "text-slate-400",
        isCenter && "text-lg text-indigo-100"
      )}>
        {title}
      </span>
      
      {/* Active Pulse Ring */}
      {isActive && (
        <motion.div
          layoutId="active-ring"
          className={cn("absolute inset-0 rounded-2xl border-2 opacity-50", `border-${color}-500`)}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const ConnectionLine = ({ active, color, verticalOffset = 0 }: { active: boolean, color: string, verticalOffset?: number }) => {
    // Generate a unique ID for the gradient to avoid conflicts
    const gradientId = `gradient-${color}-${verticalOffset}`;

    return (
      <div className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none overflow-hidden z-10" style={{ transform: `translateY(${verticalOffset}px)` }}>
        <svg className="w-full h-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          
          {/* Base Line (Dim) */}
          <path 
            d="M0,48 C100,48 100,48 200,48" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-slate-800"
            vectorEffect="non-scaling-stroke"
          />

          {/* Active Flowing Line */}
          {active && (
            <>
              {/* The Glowing Path */}
              <motion.path
                d="M0,48 C100,48 100,48 200,48"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="3"
                className={cn(`text-${color}-500`)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              
              {/* The Particle Dot */}
              <motion.circle
                r="4"
                fill="currentColor"
                className={cn(`text-${color}-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`)}
              >
                {/* FIX: Use standard SVG <animateMotion> instead of <motion.animateMotion> 
                   We also changed 'repeat' to 'repeatCount="indefinite"' for standard SVG compatibility.
                */}
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

  // Auto-cycle through sources if user isn't interacting
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSource((prev) => (prev === null || prev === 3 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sources = [
    { id: 0, title: "HubSpot", icon: Users, color: "orange" }, // Using standard tailwind colors for simplicity in demo
    { id: 1, title: "Shopify", icon: ShoppingCart, color: "emerald" },
    { id: 2, title: "Stripe", icon: CreditCard, color: "violet" },
    { id: 3, title: "Internal DB", icon: Database, color: "blue" },
  ];

  const destinations = [
    { id: "ai", title: "AI Models", icon: BrainCircuit, color: "fuchsia" },
    { id: "dash", title: "Dashboard", icon: LayoutDashboard, color: "indigo" },
  ];

  return (
    <div className="w-full py-20 bg-[#0f0518] relative overflow-hidden rounded-3xl border border-white/5">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
          
          {/* COLUMN 1: SOURCES */}
          <div className="flex flex-col gap-6 w-full md:w-auto">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 text-center md:text-left">Data Sources</h3>
            {sources.map((source, index) => (
              <div key={source.id} className="relative group flex items-center">
                <Card 
                  {...source} 
                  isActive={activeSource === index} 
                  onClick={() => setActiveSource(index)}
                />
                
                {/* Horizontal Connection Line (Desktop) */}
                <div className="hidden md:block absolute left-full top-1/2 w-24 lg:w-32 h-1 -translate-y-1/2 z-0">
                   {/* We pass a custom offset calculation to make lines converge */}
                   <ConnectionLine 
                     active={activeSource === index} 
                     color={source.color} 
                   />
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 2: WAREHOUSE (CENTER) */}
          <div className="relative flex flex-col items-center justify-center mx-12">
             {/* Converging Lines Visual Fix: Use a large SVG behind everything to draw lines from Left -> Center */}
             {/* For this specific simplified component, we rely on the horizontal spacers, but in a full app we'd use absolute SVG paths */}
            
            <motion.div 
              animate={{ 
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 0 20px -5px rgba(79, 70, 229, 0.3)",
                  "0 0 50px -10px rgba(79, 70, 229, 0.6)",
                  "0 0 20px -5px rgba(79, 70, 229, 0.3)"
                ]
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

            {/* Pulsing "Processing" Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-12 text-center"
            >
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Processing {sources[activeSource || 0].title} Stream...
              </div>
            </motion.div>
          </div>

          {/* COLUMN 3: DESTINATIONS */}
          <div className="flex flex-col gap-8 w-full md:w-auto relative">
             <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 text-center md:text-right">Action Layer</h3>
            {destinations.map((dest, i) => (
              <div key={dest.id} className="relative flex items-center">
                {/* Connection Lines from Center -> Right */}
                <div className="hidden md:block absolute right-full top-1/2 w-24 lg:w-32 h-1 -translate-y-1/2 z-0 rotate-180">
                   <ConnectionLine 
                     active={true} 
                     color={dest.color} 
                   />
                </div>

                <Card 
                  {...dest} 
                  isActive={true} 
                  isDest={true}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}