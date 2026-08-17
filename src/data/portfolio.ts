/**
 * All site content. Kept out of the components so the dashboard shell stays
 * about layout and motion, and copy edits never touch JSX.
 *
 * Image paths are all root-absolute (`/foo.png`) — they resolve from `public/`.
 */

export const identity = {
  name: "Kayne Lee",
  headshot: "/headshot.jpg",
  role: "Software Engineer Intern",
  company: "Microsoft",
  study: "Computer Engineering, Queen's University",
  links: [
    { label: "kayne.lee2@outlook.com", short: "Email", href: "mailto:kayne.lee2@outlook.com" },
    { label: "linkedin.com/in/kaynelee", short: "LinkedIn", href: "https://www.linkedin.com/in/kaynelee" },
    { label: "github.com/kayne-lee", short: "GitHub", href: "https://github.com/kayne-lee" },
  ],
} as const;

export type Job = {
  id: number;
  title: string;
  company: string;
  period: string;
  /** Shown on the tile timeline strip. */
  shortPeriod: string;
  location?: string;
  /** Prose form. Use this or `bullets`, not both. */
  description?: string;
  /** Resume form — one achievement per line. */
  bullets?: string[];
  image: string;
  current?: boolean;
};

export const experience: Job[] = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "Microsoft",
    period: "May 2026 — Present",
    shortPeriod: "2026",
    location: "Redmond, Washington",
    bullets: [
      "Built a C# and Python benchmarking harness in Azure ML evaluating PermutationSHAP, TreeSHAP, and MC-Oracle explainers on payment risk models for accuracy, stability, and production latency.",
      "Shipped an incident response agent with tool calling over Kusto telemetry that triages flagged payment decisions, detects model drift and false positive spikes, and routes reviewer-ready summaries.",
      "Authored SCOPE jobs on COSMOS distributed compute, building datasets across 24M+ payment predictions.",
      "Scoped agent tool calls to each user's own data access, enforcing per-user authorization across tenants.",
      "Cut false positives 17% with stacked LightGBM ensembles; sampling cut explainer compute 62%.",
    ],
    image: "/ms.png",
    current: true,
  },
  {
    id: 2,
    title: "Software Engineer Intern",
    company: "IBM",
    period: "September 2025 — April 2026",
    shortPeriod: "2025",
    description:
      "Engineered an enterprise agentic AI platform in Markham, ON using LangGraph, hybrid retrieval, and protocol-based tool routing to support 5,000+ internal users. Enabled the A2A protocol between specialized agents, allowing them to share context, delegate tasks, and coordinate multi-step workflows across enterprise systems. Built failure-mode detection, safe fallback routing, and latency tests for distributed agent workflows, reducing critical errors by 23% while improving reliability.",
    image: "/ibm.png",
  },
  {
    id: 3,
    title: "Founding Engineer",
    company: "AdvisorScore",
    period: "March 2025 — December 2025",
    shortPeriod: "2025",
    description:
      "Built a Qdrant-powered semantic retrieval layer to normalize and match messy holding names to canonical entities, improving downstream scoring accuracy for a financial commerce product. Developed risk and benchmark comparison logic that transforms raw data into decision-ready scores and insights. Automated AWS Lambda ingestion and scoring pipelines, cutting manual work by 60% while improving throughput.",
    image: "/as.png",
  },
  {
    id: 4,
    title: "Software Engineer Intern",
    company: "SafetyPower",
    period: "May 2025 — August 2025",
    shortPeriod: "2025",
    description:
      "Reduced project tracking time by half by launching a Django MVC system that supported more than one hundred and fifty active projects through Dockerized Linux deployments, creating a reliable and scalable foundation for operations. I also rolled out an internal LLM and RAG portal to over two hundred employees with curated indexing and access controls, which made finding the right information much faster and led to a major improvement in team decision making. This helped shorten knowledge lookup time by seventy percent and created smoother collaboration across different groups.",
    image: "/sp.jpg",
  },
  {
    id: 5,
    title: "Software Engineer Intern",
    company: "STraffic America",
    period: "May 2024 — August 2024",
    shortPeriod: "2024",
    description:
      "Achieved a detection accuracy of ninety seven percent on over three hundred thousand images by training and calibrating YOLOv10X across San Francisco and Washington, D.C. camera feeds, enabling a ten million dollar revenue recovery pipeline. Iteration speed was accelerated through the orchestration of a complete vision ETL process covering ingestion, cleaning, normalization, annotation, and augmentation, which resulted in fully automated retraining workflows and faster model improvement cycles.",
    image: "/st.png",
  },
];

export const education = {
  degree: "B.S. Computer Engineering",
  school: "Queen's University",
  start: "September 2022",
  end: "December 2027",
  startYear: 2022,
  endYear: 2027,
  coursework: [
    "Data Structures & Algorithms",
    "Computer Architecture",
    "Operating Systems",
    "Object-Oriented Programming",
    "Software Development",
    "Database Systems",
    "Computer Networks",
  ],
  honors: [
    "Queen's University Excellence Scholarship",
    "OKBA Excellence Scholarship",
    "Pitch Competition Winner — QTMA McKinsey Pitch Competition",
  ],
};

export type Project = {
  id: number;
  title: string;
  /** Tile-length name — the full title is too long for a 1x1 tile. */
  short: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Nucleus: The All-in-One Student Productivity Hub",
    short: "Nucleus",
    description:
      "Built by students for students. Nucleus parses syllabi to pull key dates and deliverables, auto-generates a weekly task view, lets you add custom task tiles, syncs deadlines to your calendar, and tracks grades with what-if scenarios. React frontend talks to a Spring Boot API and a Node email service, packaged with Docker and secured with JWT.",
    tech: ["React", "Spring Boot", "Java 17", "Node.js", "SMTP", "PostgreSQL", "Docker", "JWT"],
    link: "github.com/kayne-lee/nucleusapp",
    image: "/nucleus.png",
  },
  {
    id: 2,
    title: "Computer Vision Keyboard",
    short: "CV Keyboard",
    description:
      "Developed a Python application using OpenCV and MediaPipe that enables hands-free typing by recognizing hand gestures through a webcam. Integrated a virtual keyboard with predictive text and auto-correction, achieving 95% gesture accuracy and a 30% increase in typing speed for users with limited mobility. The system supports customizable layouts, gesture sensitivity, and multiple languages for a responsive and accessible user experience.",
    tech: ["Python", "OpenCV", "MediaPipe"],
    link: "github.com/kayne-lee/Computer-Vision-Keyboard",
    image: "/cv.png",
  },
  {
    id: 3,
    title: "Caption Generator",
    short: "Caption Generator",
    description:
      "Developed a Next.js application that enables user-generated video uploads, integrating Amazon S3 for efficient storage and achieving a 50% reduction in server load and 20% faster upload speeds. Implemented a dynamic captioning feature using Amazon Transcribe, allowing users to personalize captions with adjustable fonts, colors, and positioning. The system provides a smooth video-to-text conversion pipeline with customizable styling options.",
    tech: ["AWS", "Next.js", "S3", "Amazon Transcribe"],
    link: "github.com/kayne-lee/Caption-Creator",
    image: "/cg.png",
  },
  {
    id: 4,
    title: "NumerAI Model",
    short: "NumerAI Model",
    description:
      "Built a Numerai trading pipeline that ranked Top 20 in North America over 3 months, generating roughly 60% returns. Used Numerai's API to parse and organize the data, then trained a LightGBM model with era-based validation to improve robustness and reduce overfitting under shifting market regimes.",
    tech: ["Python", "LightGBM", "scikit-learn", "NumerAI"],
    link: "github.com/kayne-lee/NumerAI-Model",
    image: "/nm.png",
  },
];

export type Hobby = { id: number; title: string; description: string; image: string };

export const hobbies: Hobby[] = [
  { id: 1, title: "Football", description: "Varsity High School Football Team", image: "/Football.png" },
  {
    id: 2,
    title: "Hockey",
    description: "Kincardine Minor Hockey Team & Guelph Gryphons Hockey Team",
    image: "/Hockey.png",
  },
  {
    id: 3,
    title: "Skating",
    description:
      "Love skateboarding and longboarding. It's a great way to stay active and cruise around the city.",
    image: "/Skate.png",
  },
  {
    id: 4,
    title: "Shoe Collection",
    description:
      "Love collecting shoes and adding new ones to my collection. It's a great way to express my style and personality. (Air Jordan 1 Obsidian's are my favorite)",
    image: "/Shoe.png",
  },
  {
    id: 5,
    title: "Fitness & Working Out",
    description:
      "Dedicated to maintaining a healthy lifestyle through regular gym sessions, weightlifting, and various fitness routines.",
    image: "/Workout.png",
  },
  {
    id: 6,
    title: "Hiking",
    description:
      "Love getting outdoors and exploring trails. Hiking is a great way to disconnect, take in some scenery, and reset.",
    image: "/hiking.JPG",
  },
];

export type Activity = {
  id: number;
  title: string;
  organization: string;
  period: string;
  /** Fits the tile, where the full range truncates. */
  shortPeriod: string;
  description: string;
  image: string;
  current?: boolean;
};

export const extracurriculars: Activity[] = [
  {
    id: 1,
    title: "Director of Developers, Senior Software Developer",
    organization: "QTMA",
    period: "March 2024 — May 2026",
    shortPeriod: "2024 — 2026",
    description:
      "Led technical execution across 4 teams, mentoring 10+ engineers and driving architecture decisions. Standardized debugging, review, and delivery practices to improve consistency and overall quality across teams.",
    image: "/QTMA.png",
  },
  {
    id: 2,
    title: "Product Team",
    organization: "QMIND",
    period: "2023 — 2024",
    shortPeriod: "2023 — 2024",
    description:
      "Engineered the QMIND.ca website. Implemented the front end using Next.js and backend system of Supabase to allow users to sign in with JWT authentication system and submit their projects for display on the website.",
    image: "/QMIND.png",
  },
  {
    id: 3,
    title: "iCon",
    organization: "iCons",
    period: "2023 — 2025",
    shortPeriod: "2023 — 2025",
    description:
      "Operated after ILC administration hours to keep the facility open to students, promote a positive studying and learning atmosphere, and act as a resource to undergraduate students for academic courses.",
    image: "/ICONS.png",
  },
];

export const current = {
  projects: [
    {
      id: 1,
      title: "Advisor Score",
      description: "Working on deploying advisor score soon, then focusing on learning and studying more ML stuff.",
      tech: ["AWS", "LangChain", "LLMs"],
    },
    {
      id: 2,
      title: "ML Learning",
      description: "Diving deeper into machine learning concepts and building AI agents.",
      tech: ["Python", "ML", "AI"],
    },
  ],
  gymProgress: [
    { label: "Current Split", value: "Upper, Lower, Chest/Back, Shoulders/Arms, Lower, Upper, Rest" },
    { label: "Focus", value: "Progressive Overload" },
    { label: "Goal", value: "Muscle Definition" },
    { label: "Favourite Exercise", value: "Dumbbell Incline Bench Press" },
  ],
  books: [
    {
      id: 1,
      title: "Atomic Habits",
      shortTitle: "Atomic Habits",
      author: "James Clear",
      description: "Building good habits and breaking bad ones.",
      progress: 50,
      image: "/ah.jpg",
    },
    {
      id: 2,
      title: "Principles of Building AI Agents",
      shortTitle: "AI Agents",
      author: "Sam Bhagwat",
      description:
        "2nd edition by Sam Bhagwat, cofounder and CEO of Mastra.ai. Deep dive into AI agent development.",
      progress: 40,
      image: "/aia.jpg",
    },
  ],
  music: [
    { title: "crushing", artist: "Sombr", link: "https://open.spotify.com/search/crushing%20sombr" },
    { title: "Crazy", artist: "BUNT. and Myles Lloyd", link: "https://open.spotify.com/search/crazy%20bunt" },
  ],
  focusAreas: [
    "Diving into Quantt",
    "Finding new spots in Toronto",
    "Experimenting with AI/ML tools",
    "Building AI agents",
  ],
};
