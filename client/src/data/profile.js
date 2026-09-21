// Portfolio content summarized from Shubham's resume.
export const profile = {
  name: "Shubham Lakhotia",
  title: "AI Software Engineer",
  summary: "I build production LLM applications, RAG pipelines, and distributed systems. My work spans AI workflows, APIs, and full-stack applications deployed across AWS and Azure.",
  experience: [
    {
      company: "Annaly Capital Management",
      role: "Software Engineer, Co-op",
      dates: "Jun 2025 – Dec 2025",
      location: "New York, USA",
      summary: "Real-time applications, AI-assisted investigation, and data quality systems.",
      highlights: [
        "Engineered C#/.NET APIs processing 1,000+ data updates per second, supported by TDD-driven unit tests.",
        "Built a LangGraph-based anomaly investigation workflow combining outlier detection and RAG to generate contextual explanations for analysts.",
        "Developed an ML validation pipeline that reduced downstream data-quality incidents by 35%.",
        "Migrated MSSQL workloads to Azure SQL and optimized queries and stored procedures, reducing data latency by 40%.",
      ],
    },
    {
      company: "Jio Platforms",
      role: "Senior Software Engineer",
      dates: "Jul 2022 – Dec 2023",
      location: "Mumbai, India",
      summary: "Enterprise AI, frontend architecture, and engineering leadership.",
      highlights: [
        "Architected an enterprise RAG platform for 100,000+ employees, reducing support tickets by 35% and resolution time from two days to ten minutes.",
        "Integrated 7+ React and Angular applications through a Module Federation platform with independent releases.",
        "Led eight engineers while modernizing 15+ services with Docker, Kubernetes/AWS EKS, and Kafka.",
      ],
    },
    {
      company: "Jio Platforms",
      role: "Software Engineer",
      dates: "Jun 2021 – Jun 2022",
      location: "Mumbai, India",
      summary: "Computer vision applications, API performance, and reusable frontend systems.",
      highlights: [
        "Built the React frontend and Java backend for an AI proctoring system using YOLO and TensorFlow CNNs.",
        "Improved data retrieval by 35% with REST and GraphQL APIs, MongoDB, and Redis caching.",
        "Established a library of 30+ reusable React and Angular components across three product teams.",
      ],
    },
  ],
  education: [
    { school: "Northeastern University", degree: "MS, Information Systems", dates: "Jan 2024 – May 2026", gpa: "3.9", location: "Boston, USA" },
    { school: "SRM University", degree: "BS, Computer Science", dates: "May 2017 – May 2021", gpa: "3.7", location: "Chennai, India" },
  ],
  skills: [
    { category: "Languages", items: ["Python", "C#", "Java", "TypeScript", "JavaScript", "SQL", "Go", "Swift"] },
    { category: "Applications & APIs", items: ["React", "Next.js", "Node.js", ".NET Core", "FastAPI", "Spring Boot", "Angular", "GraphQL"] },
    { category: "AI & machine learning", items: ["RAG", "LangChain", "LangGraph", "PyTorch", "TensorFlow", "Scikit-learn", "Pinecone"] },
    { category: "Cloud & data", items: ["AWS", "Azure", "Docker", "Kubernetes", "Kafka", "PostgreSQL", "MongoDB", "Redis"] },
  ],
};
