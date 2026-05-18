import type { PersonalInfo, Project, ExperienceItem, Skills } from "@/types";

export const PERSONAL_INFO: PersonalInfo = {
  name: "Atul Parmar",
  title: "Full Stack Developer & AI Engineer",
  taglines: [
    "I build systems that think.",
    "Interfaces that feel.",
    "Experiences that last.",
  ],
  email: "atulparmar0021@gmail.com",
  github: "https://github.com/Atulx21",
  linkedin: "atul-parmar",
  location: "Guwahati, Assam",
  college: "IIIT Guwahati",
  degree: "B.Tech CSE, 2022–2026",
};

export const PROJECTS: Project[] = [
  {
    id: "ai-tutor",
    title: "AI-Tutor",
    description:
      "A context-aware tutoring system powered by RAG pipelines and large language models. Ask anything — it retrieves, reasons, and responds with precision.",
    longDescription:
      "AI-Tutor is a full-stack intelligent tutoring application built on a Retrieval-Augmented Generation architecture. Users upload course material which is chunked, embedded via HuggingFace models, and indexed in a FAISS vector store. At query time, the system retrieves the most semantically relevant passages and feeds them as context to an LLM, producing grounded, citation-aware responses. The React frontend streams answers in real time while a FastAPI backend manages ingestion, retrieval, and LangChain orchestration. Session memory allows multi-turn conversations that stay on-topic without ballooning token counts.",
    techStack: ["React", "FastAPI", "LangChain", "MongoDB", "FAISS", "HuggingFace"],
    github: "https://github.com/Atulx21/ai-tutor",
    demo: null,
    imagePlaceholder: "#2a1f3d",
    accentColor: "#6B4FBB",
    tags: ["AI/ML", "RAG", "LLM"],
  },
  {
    id: "unilink",
    title: "UniLink",
    description:
      "A campus super-app unifying social feeds, event discovery, and peer networking for college students. Built mobile-first, backed by a real-time Supabase layer.",
    longDescription:
      "UniLink consolidates the fragmented digital life of a university campus into a single React Native application. Students can post updates, RSVP to events, form study groups, and message peers — all within a verified college network. Supabase powers authentication, row-level security, and real-time subscriptions so feeds and notifications update instantly. The PostgreSQL schema enforces institutional access control, ensuring only verified students from a given college can join that community. Expo's managed workflow enables zero-config OTA updates for rapid iteration across iOS and Android.",
    techStack: ["React Native", "Supabase", "PostgreSQL", "Expo"],
    github: "https://github.com/Atulx21/unilink",
    demo: null,
    imagePlaceholder: "#1a2e2b",
    accentColor: "#2D7A6E",
    tags: ["Full Stack", "Mobile", "Backend"],
  },
  {
    id: "moodtunes",
    title: "MoodTunes",
    description:
      "Detects your facial emotion in real time and curates a matching playlist on the fly. Music that actually reads the room.",
    longDescription:
      "MoodTunes combines computer vision and music recommendation into a seamless real-time experience. A webcam feed is analyzed by a DeepFace model served via Flask, which classifies the user's dominant emotion every few seconds. That emotion label is passed over a Socket.IO channel to a Node.js backend, which queries a curated MongoDB playlist collection and pushes a fresh track queue to the React client. The interface updates without page refresh, keeping the listening experience fluid. A manual override lets users lock a mood or shuffle within a category, blending AI suggestions with personal preference.",
    techStack: ["React", "Node.js", "MongoDB", "Socket.IO", "DeepFace", "Flask"],
    github: "https://github.com/Atulx21/moodtunes",
    demo: null,
    imagePlaceholder: "#2e1a0e",
    accentColor: "#C4733A",
    tags: ["Real-time", "AI", "Music"],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Troywings Technologies LLP",
    role: "Software Engineer Intern",
    period: "Jan 2026 – Present",
    type: "Intern",
    description: [
      "Built and maintained RESTful APIs in ASP.NET Core (C#), integrating MongoDB collections with asynchronous AJAX-driven frontends to reduce page load latency across internal dashboards.",
      "Collaborated on feature delivery in a production codebase, performing code reviews, writing unit tests, and participating in sprint ceremonies within an Agile workflow.",
    ],
    techStack: ["ASP.NET Core", "C#", "MongoDB", "AJAX"],
  },
  {
    company: "CASET",
    role: "Full Stack Developer Intern",
    period: "Jul 2024 – Aug 2024",
    type: "Intern",
    description: [
      "Designed and implemented interactive financial data visualisation components in React, translating complex datasets into clear, actionable charts for end-users.",
      "Owned the frontend architecture for a financial analytics module — built reusable UI components, integrated REST APIs, and ensured cross-browser consistency throughout.",
    ],
    techStack: ["React", "Data Visualization", "Financial UI"],
  },
];

export const SKILLS: Skills = {
  Languages: ["C", "C++", "JavaScript", "Python"],
  Databases: ["MySQL", "PostgreSQL", "MongoDB"],
  Frameworks: [
    "React",
    "React Native",
    "Node.js",
    "Express.js",
    "LangChain",
    "Tailwind",
    "Expo",
  ],
  Tools: ["Git", "GitHub", "VS Code"],
  Coursework: [
    "DSA",
    "OOP",
    "OS",
    "DBMS",
    "Networking",
    "Cloud Computing",
    "ML",
  ],
};
