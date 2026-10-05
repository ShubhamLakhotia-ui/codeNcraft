// Curated from the two Market Monitor documents and Shubham's ownership clarification.
// Keep internal endpoints, configurations, and unverified impact figures out of this reference.
export const marketMonitorPassages = [{
  id: "project-market-monitor",
  title: "Annaly Market Monitor — platform, architecture, and contribution",
  section: "project projects",
  source: "Market Monitor project documentation and Shubham’s clarification",
  url: null,
  text: `Market Monitor is a real-time financial market monitoring platform at Annaly Capital Management. It helps traders track prices, yields, and spreads for mortgage securities, Treasuries, and interest-rate swaps, compare them with the previous day's values, and explore historical data. The documents describe monitoring and analysis, not order execution.
Shubham contributed across data ingestion, backend APIs and live streaming, dashboard development, and cloud migration in collaboration with his manager. This was collaborative work, not sole ownership of the entire platform.
Think of the platform as a live scoreboard for financial markets: it collects updates, checks them, calculates changes, saves history, and updates traders' screens automatically. For example, a trader can compare a bond's current price with yesterday's price without refreshing the screen.
The core architecture uses C# / .NET services to ingest Tradeweb data, validate it, and calculate changes and spreads. Redis keeps the latest values and previous-day baselines readily available. SQL Server stores historical data and snapshots. Server-Sent Events (SSE) send updates to connected clients. The WPF desktop dashboard uses DevExpress and MVVM, with live grids and historical views.
The broader platform and migration documentation also describes RabbitMQ messaging, a React Native mobile client, Docker containers, and Azure Kubernetes Service (AKS). Distinguish these broader migration details from the core architecture. Do not invent performance metrics or describe planned scaling options as deployed features.`,
}];
