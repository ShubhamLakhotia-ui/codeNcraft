// Editorial summaries of the resume and project notes, not generated answers.
export const interviewStories = [
  {
    id: "annaly", label: "A problem I solved", topic: "Annaly anomaly investigation", context: "Annaly Capital Management · 2025", title: "From an unusual data point to an explanation.",
    steps: [
      ["The problem", "Investigating anomalies in financial data and providing context for analysts."],
      ["My contribution", "I designed a workflow combining statistical outlier detection, RAG over historical data, and an LLM orchestrated with LangGraph."],
      ["The result", "The workflow gave analysts explanations backed by historical context, helping them investigate unusual financial data."],
    ],
    source: "Based on my Annaly resume entry", question: "How did you use LangGraph and RAG at Annaly?",
  },
  {
    id: "market-monitor", label: "What I built at Annaly", topic: "Annaly Market Monitor", context: "Annaly · Market Monitor", title: "From live market data to a trader’s screen.",
    steps: [
      ["What it does", "Market Monitor helps traders follow live prices, yields, and spreads across mortgage securities, Treasuries, and swaps. They can compare movements with the previous day and explore historical data."],
      ["My contribution", "Working in collaboration with my manager, I contributed across data ingestion, backend APIs and live streaming, the dashboard, and cloud migration."],
      ["How it works", "Think of it as a live scoreboard for financial markets. The platform collects market updates, checks them, and calculates what has changed since the previous day. It keeps the latest numbers ready to display and saves older ones for comparison. As new updates arrive, the trader’s screen changes automatically—there’s no need to keep refreshing. For example, a trader can see a bond’s current price alongside how much it has risen or fallen since yesterday."],
      ["The technology", "The core platform uses C# / .NET, WPF, DevExpress, Redis, SQL Server, and SSE. The broader platform and migration work also covers RabbitMQ, React Native, Docker, and Azure AKS."],
      ["Why it matters", "Traders can see changing market conditions alongside historical context, with live updates arriving directly on their screens."],
    ],
    source: "Based on my Market Monitor project documentation",
    question: "How does Market Monitor help traders, and what did Shubham contribute?",
  },
  {
    id: "jio", label: "What I built at Jio", topic: "Jio RAG, React, backend APIs and micro-frontends", context: "Jio Platforms · 2021–2023", title: "Helping people find answers—and teams build together.",
    steps: [
      ["The RAG platform", "I architected an enterprise knowledge platform with React, FastAPI, LangChain, and Elasticsearch for 100,000+ employees. It helped employees find answers while reducing support tickets by 35% and resolution time from two days to ten minutes."],
      ["How it works", "Think of it as an assistant that looks through company documents before answering. An employee asks a question through the React interface. Behind the scenes, the system finds relevant information and uses AI to turn it into a readable answer. I also worked with support and operations teams to understand unsuccessful searches and improve how documents were prepared and searched."],
      ["React and microfrontends", "I implemented a TypeScript platform using Module Federation to bring 7+ React and Angular applications into one shared experience. Think of it as a building where different teams manage their own rooms: each team can update its part without waiting for everyone else to release. I also established a library of 30+ reusable React and Angular components across three product teams."],
      ["Backend engineering", "Across other Jio projects, I built a Java backend for an AI proctoring system, developed REST and GraphQL APIs with Node.js, MongoDB, and Redis caching, and used Spring Boot and Hibernate for an AI-powered Symptom Checker with OAuth 2.0 authentication."],
      ["Delivering at scale", "I led eight engineers while modernizing 15+ services with Docker, Kubernetes / AWS EKS, and Kafka. This increased deployment velocity by 40% and reduced deployment failures by 60%."],
    ],
    source: "Based on my Jio resume entries", question: "How did Shubham use React and microfrontends at Jio?",
  },
  {
    id: "conversation", label: "Something I’m building now", topic: "Conversational UI project", context: "Conversational UI · In progress", title: "A conversation that starts with typing or talking.",
    steps: [
      ["The idea", "Explore a chat interface where people can type a message or speak it."],
      ["What I built", "A React prototype with browser voice recognition, live transcript previews, typed messages, and visible microphone controls."],
      ["What comes next", "This separate project currently uses demo replies. Connecting it to an AI service is the next step."],
    ],
    source: "Based on my Conversational UI project notes", question: "How does voice input work in the Conversational UI project?",
  },
];
