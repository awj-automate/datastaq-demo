// app/data.ts

export const icpData: any = {
  "pro-services": {
    title: "Services Growth Dashboard",
    painPoint: "Utilization & Margin Visibility",
    integrations: ["Harvest", "Salesforce", "QuickBooks"],
    kpis: [
      { title: "Billable Utilization", metric: "82%", delta: "+4%", deltaType: "increase", subtext: "vs 78% target" },
      { title: "Project Margin", metric: "38%", delta: "-2%", deltaType: "decrease", subtext: "Budget variance" },
      { title: "WIP Revenue", metric: "$142k", delta: "+12%", deltaType: "increase", subtext: "Unbilled hours" },
    ],
    chartTitle: "Consultant Capacity vs. Actual Billables",
    chartData: [
      { name: "Week 1", Billable: 1400, Bench: 200 },
      { name: "Week 2", Billable: 1500, Bench: 100 },
      { name: "Week 3", Billable: 1350, Bench: 250 },
      { name: "Week 4", Billable: 1600, Bench: 50 },
    ]
  },
  "marketing-agency": {
    title: "Agency Client Portal",
    painPoint: "Cross-Channel ROAS Aggregation",
    integrations: ["Meta Ads", "Google Ads", "LinkedIn"],
    kpis: [
      { title: "Aggregate ROAS", metric: "3.4x", delta: "+0.2", deltaType: "increase", subtext: "Blended across channels" },
      { title: "Client Churn Risk", metric: "Low", delta: "Stable", deltaType: "unchanged", subtext: "Based on engagement" },
      { title: "Agency Gross Margin", metric: "45%", delta: "+5%", deltaType: "increase", subtext: "After ad spend" },
    ],
    chartTitle: "CPA Trends by Channel (Last 30 Days)",
    chartData: [
      { name: "Week 1", Meta: 45, Google: 32, LinkedIn: 85 },
      { name: "Week 2", Meta: 42, Google: 35, LinkedIn: 80 },
      { name: "Week 3", Meta: 40, Google: 30, LinkedIn: 75 },
      { name: "Week 4", Meta: 38, Google: 33, LinkedIn: 78 },
    ]
  },
  "legal-ops": {
    title: "Multi-Location Ops View",
    painPoint: "Location Performance Comparison",
    integrations: ["Clio", "RingCentral", "Excel"],
    kpis: [
      { title: "New Matters (MoM)", metric: "124", delta: "+12", deltaType: "increase", subtext: "Across all locations" },
      { title: "Avg Resolution Time", metric: "42 Days", delta: "-3 Days", deltaType: "increase", subtext: "Efficiency gain" },
      { title: "Revenue per Partner", metric: "$85k", delta: "flat", deltaType: "unchanged", subtext: "Monthly avg" },
    ],
    chartTitle: "Case Volume by Location",
    chartData: [
      { name: "New York", Volume: 140, Efficiency: 90 },
      { name: "Chicago", Volume: 110, Efficiency: 85 },
      { name: "Austin", Volume: 95, Efficiency: 92 },
      { name: "Miami", Volume: 80, Efficiency: 78 },
    ]
  },
  "saas-founder": {
    title: "Founder Command Center",
    painPoint: "Investor-Ready Metrics (No Spreadsheets)",
    integrations: ["Stripe", "Baremetrics", "HubSpot"],
    kpis: [
      { title: "MRR", metric: "$45,200", delta: "+8.1%", deltaType: "increase", subtext: "Net new + Expansion" },
      { title: "Runway", metric: "14.5 Mo", delta: "-0.5", deltaType: "moderateDecrease", subtext: "Based on current burn" },
      { title: "CAC:LTV Ratio", metric: "1:4.2", delta: "Good", deltaType: "increase", subtext: "Efficient growth" },
    ],
    chartTitle: "Net Revenue Retention Cohorts",
    chartData: [
      { name: "Q1", New: 40000, Expansion: 5000, Churn: -2000 },
      { name: "Q2", New: 45000, Expansion: 7000, Churn: -1500 },
      { name: "Q3", New: 52000, Expansion: 9000, Churn: -2200 },
      { name: "Q4", New: 60000, Expansion: 12000, Churn: -1800 },
    ]
  },
  "pe-portfolio": {
    title: "Portfolio EBITDA Monitor",
    painPoint: "Standardized Reporting Across Portcos",
    integrations: ["Netsuite", "Xero", "Sage"],
    kpis: [
      { title: "Consolidated EBITDA", metric: "$4.2M", delta: "+6%", deltaType: "increase", subtext: "Q3 Actuals" },
      { title: "Debt Covenants", metric: "Pass", delta: "Safe", deltaType: "unchanged", subtext: "Leverage < 3.0x" },
      { title: "Cash Position", metric: "$12M", delta: "-1M", deltaType: "decrease", subtext: "Aggregated" },
    ],
    chartTitle: "Revenue Contribution by Portfolio Company",
    chartData: [
      { name: "Portco A", Revenue: 1200000 },
      { name: "Portco B", Revenue: 900000 },
      { name: "Portco C", Revenue: 2100000 },
    ]
  }
};