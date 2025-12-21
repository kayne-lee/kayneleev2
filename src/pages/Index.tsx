import { useEffect, useRef, useState } from "react";
import { Briefcase, GraduationCap, Code, Wrench, Heart, X, Calendar, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import IconCloud from "@/components/IconCloud";

type Section = "experience" | "education" | "projects" | "techstack" | "hobbies" | "current" | "extracurriculars" | null;
type ConcreteSection = Exclude<Section, null>;
type SectionDefinition = {
  id: ConcreteSection;
  title: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  itemCount: number;
};

type OverlayRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const CONTAINER_RADIUS = 24;
const ANIMATION_DURATION_MS = 450;

// Database for section content
const sectionData = {
  experience: [
    {
      id: 1,
      title: "Software Developer Intern",
      company: "IBM",
      period: "September 2025 - Present",
      description: "Scaled an agentic AI platform to over five thousand users by orchestrating complex pipelines with LangChain and implementing dual-mode retrieval using both vector and keyword search on Elasticsearch. This significantly improved response speed and increased the relevance of answers returned to users. To ensure stability and reliable deployments, I built a multi-layer end-to-end testing suite that covered the frontend, backend, and LLM response quality while also introducing a robust staging CI/CD pipeline with gated validation. This created a safer release process and improved overall product quality.",
      image: '/ibm.png', // Add image path here
      highlights: []
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "AdvisorScore",
      period: "March 2025 - Present",
      description: "Improved performance by re-architecting a full stack advisor grading application into AWS Lambda microservices, which reduced load times by eighty percent and created a noticeably smoother user experience with faster report generation. I also normalized more than fifteen thousand holdings using semantic search to disambiguate fund names and enforced structured outputs with LangGraph schemas, backed by staging CI/CD tests. This resulted in highly accurate, schema valid reports and a more reliable data pipeline.",
      image: '/as.png',
      highlights: []
    },
    {
      id: 3,
      title: "Software Engineer Intern",
      company: "SafetyPower",
      period: "May 2025 - August 2025",
      description: "Reduced project tracking time by half by launching a Django MVC system that supported more than one hundred and fifty active projects through Dockerized Linux deployments, creating a reliable and scalable foundation for operations. I also rolled out an internal LLM and RAG portal to over two hundred employees with curated indexing and access controls, which made finding the right information much faster and led to a major improvement in team decision making. This helped shorten knowledge lookup time by seventy percent and created smoother collaboration across different groups.",
      image: '/sp.jpg',
      highlights: []
    },
    {
      id: 4,
      title: "Software Engineer Intern",
      company: "STraffic America",
      period: "May 2024 - August 2024",
      description: "Achieved a detection accuracy of ninety seven percent was achieved on over three hundred thousand images by training and calibrating YOLOv10X across San Francisco and Washington, D.C. camera feeds, enabling a ten million dollar revenue recovery pipeline. Iteration speed was accelerated through the orchestration of a complete vision ETL process covering ingestion, cleaning, normalization, annotation, and augmentation, which resulted in fully automated retraining workflows and faster model improvement cycles.",
      image: '/st.png',
      highlights: []
    },

  ],
  projects: [
    {
      id: 1,
      title: "Nucleus: The All-in-One Student Productivity Hub",
      description: "Built by students for students. Nucleus parses syllabi to pull key dates and deliverables, auto-generates a weekly task view, lets you add custom task tiles, syncs deadlines to your calendar, and tracks grades with what-if scenarios. React frontend talks to a Spring Boot API and a Node email service, packaged with Docker and secured with JWT.",
      tech: ["React", "Spring Boot", "Java 17", "Node.js", "SMTP", "PostgreSQL", "Docker", "JWT"],
      link: "github.com/kayne-lee/nucleusapp",
      image: 'nucleus.png'
    },
    {
      id: 2,
      title: "Computer Vision Keyboard",
      description: "Developed a Python application using OpenCV and MediaPipe that enables hands-free typing by recognizing hand gestures through a webcam. Integrated a virtual keyboard with predictive text and auto-correction, achieving 95% gesture accuracy and a 30% increase in typing speed for users with limited mobility. The system supports customizable layouts, gesture sensitivity, and multiple languages for a responsive and accessible user experience.",
      tech: ["Python", "OpenCV", "MediaPipe"],
      link: "github.com/kayne-lee/Computer-Vision-Keyboard",
      image: 'cv.png'
    },
    {
      id: 3,
      title: "Caption Generator",
      description: "Developed a Next.js application that enables user-generated video uploads, integrating Amazon S3 for efficient storage and achieving a 50% reduction in server load and 20% faster upload speeds. Implemented a dynamic captioning feature using Amazon Transcribe, allowing users to personalize captions with adjustable fonts, colors, and positioning. The system provides a smooth video-to-text conversion pipeline with customizable styling options.",
      tech: ["AWS", "Next.js", "S3", "Amazon Transcribe"],
      link: "github.com/kayne-lee/Caption-Creator",
      image: 'cg.png'
    },
    {
      id: 4,
      title: "NumerAI Model",
      description: "Developped a ML model to participate in the NumerAI tournament to trade crypto currencies. Currently have a 12% profit and ranked top 25 in the season. Used NumerAI's API to parse and organize the data and then used a LightGBM model to process the data given by NumerAI.",
      tech: ["Python", "LightGBM", "NumerAI"],
      link: "github.com/kayne-lee/NumerAI-Model",
      image: 'nm.png'
    }
  ],
  hobbies: [
    {
      id: 1,
      title: "Football",
      description: "Varsity High School Football Team",
      image: '/Football.png'
    },
    {
      id: 2,
      title: "Hockey",
      description: "Kincardine Minor Hockey Team & Guelph Gryphons Hockey Team",
      image: '/Hockey.png'
    },
    {
      id: 3,
      title: "Skating",
      description: "Love skateboarding and longboarding. It's a great way to stay active and cruise around the city.",
      image: '/Skate.png'
    },
    {
      id: 4,
      title: "Shoe Collection",
      description: "Love collecting shoes and adding new ones to my collection. It's a great way to express my style and personality. (Air Jordan 1 Obsidian's are my favorite)",
      image: '/Shoe.png'
    },
    {
      id: 5,
      title: "Fitness & Working Out",
      description: "Dedicated to maintaining a healthy lifestyle through regular gym sessions, weightlifting, and various fitness routines.",
      image: '/Workout.png'
    },
  ],
  extracurriculars: [
    {
      id: 1,
      title: "Director of Developers",
      organization: "QTMA",
      period: "March 2025 - Present",
      description: "Improved on-time delivery across 4 teams by instituting weekly planning, design/code reviews, and mentoring 10+ engineers, resulting in projects aligned with organizational goals.",
      image: 'QTMA.png'
    },
    {
      id: 2,
      title: "Product Team",
      organization: "QMIND",
      period: "2023 - 2024",
      description: "Engineered the QMIND.ca website. Implemented the front end using Next.js and backend system of Supabase to allow users to sign in with JWT authentication system and submit their projects for display on the website.",
      image: 'QMIND.png'
    },
    {
      id: 3,
      title: "iCon",
      organization: "iCons",
      period: "2023 - 2025",
      description: "Operated after ILC administration hours to keep the facility open to students promote a positive studying and learning atmosphere, and to act as a resource to undergraduate students for academic courses.",
      image: 'ICONS.png'
    },
    
  ],
  current: {
    projects: [
      {
        id: 1,
        title: "Advisor Score",
        description: "Working on deploying advisor score soon, then focusing on learning and studying more ML stuff.",
        tech: ["AWS", "LangChain", "LLMs"],
        image: null
      },
      {
        id: 2,
        title: "ML Learning",
        description: "Diving deeper into machine learning concepts and building AI agents.",
        tech: ["Python", "ML", "AI"],
        image: null
      }
    ],
    gymProgress: [
      { label: "Current Split", value: "Upper, Lower, Chest/Back, Shoulders/Arms, Lower, Upper, Rest" },
      { label: "Focus", value: "Progressive Overload" },
      { label: "Goal", value: "Muscle Definition" },
      { label: "Favourite Exercise", value: "Dumbell Incline Bench Press" }
    ],
    books: [
      {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        description: "Building good habits and breaking bad ones.",
        progress: 50,
        image: 'ah.jpg'
      },
      {
        id: 2,
        title: "Principles of Building AI Agents",
        author: "Sam Bhagwat",
        description: "2nd edition by Sam Bhagwat, cofounder and CEO Mastra.ai. Deep dive into AI agent development.",
        progress: 40,
        image: 'aia.jpg'
      }
    ],
    music: [
      { title: "crushing", artist: "Sombr", link: "https://open.spotify.com/search/crushing%20sombr" },
      { title: "Crazy", artist: "BUNT. and Myles Lloyd", link: "https://open.spotify.com/search/crazy%20bunt" }
    ],
    focusAreas: [
      "Diving into Quantt",
      "Finding new spots in Toronto",
      "Experimenting with AI/ML tools",
      "Building AI agents"
    ]
  }
};

const Index = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const closeTimeoutRef = useRef<number>();
  const cardRefs = useRef<Record<ConcreteSection, HTMLDivElement | null>>({
    experience: null,
    education: null,
    projects: null,
    techstack: null,
    hobbies: null,
    current: null,
    extracurriculars: null,
  });

  const [visibleSection, setVisibleSection] = useState<Section>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState<OverlayRect | null>(null);
  const [overlayRadius, setOverlayRadius] = useState(CONTAINER_RADIUS);
  const [showContent, setShowContent] = useState(false);
  const [cachedCardRect, setCachedCardRect] = useState<OverlayRect | null>(null);

  const sections: SectionDefinition[] = [
    {
      id: "experience",
      title: "Professional Experience",
      metric: "4",
      metricLabel: "Positions",
      icon: Briefcase,
      itemCount: sectionData.experience.length,
    },
    {
      id: "education",
      title: "Education",
      metric: "Queen's University",
      metricLabel: "Computer Engineering",
      icon: GraduationCap,
      itemCount: 1,
    },
    {
      id: "projects",
      title: "Projects",
      metric: "4",
      metricLabel: "Built & Deployed",
      icon: Code,
      itemCount: sectionData.projects.length,
    },
    {
      id: "techstack",
      title: "Tech Stack",
      metric: "20+",
      metricLabel: "Technologies",
      icon: Wrench,
      itemCount: 5,
    },
    {
      id: "hobbies",
      title: "Hobbies",
      metric: "Beyond",
      metricLabel: "The Code",
      icon: Heart,
      itemCount: sectionData.hobbies.length,
    },
    {
      id: "current",
      title: "Current Focus",
      metric: "Active",
      metricLabel: "Today",
      icon: Calendar,
      itemCount: sectionData.current.projects.length + sectionData.current.books.length,
    },
    {
      id: "extracurriculars",
      title: "Extracurriculars",
      metric: "3",
      metricLabel: "Activities",
      icon: Users,
      itemCount: sectionData.extracurriculars.length,
    },
  ];

  const currentSection = visibleSection
    ? sections.find((section) => section.id === visibleSection) ?? null
    : null;
  const SectionIcon = currentSection?.icon;

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const renderSectionContent = (section: Section) => {
    switch (section) {
      case "experience":
        return (
          <div className="space-y-6">
            {sectionData.experience.map((job, index) => (
              <div key={job.id} className={`border-l-2 ${index === 0 ? 'border-accent' : 'border-muted'} pl-6 space-y-2`}>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    {job.image ? (
                      <img src={job.image} alt={job.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl text-accent font-bold">{job.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-2xl font-serif font-semibold">{job.title}</h3>
                      <p className={index === 0 ? "text-accent font-medium" : "text-muted-foreground font-medium"}>{job.company}</p>
                      <span className="text-muted-foreground text-sm">{job.period}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="space-y-8">
            <div className="border-l-2 border-accent pl-6 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif font-semibold">B.S. Computer Engineering</h3>
                  <p className="text-accent font-medium">Queen's University</p>
                </div>
                <span className="text-muted-foreground">September 2022 - April 2027</span>
              </div>
              <div className="space-y-2 mt-4">
                <p className="font-medium">Relevant Coursework:</p>
                <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <li>• Data Structures & Algorithms</li>
                  <li>• Computer Architecture</li>
                  <li>• Operating Systems</li>
                  <li>• Object-Oriented Programming</li>
                  <li>• Software Development</li>
                  <li>• Database Systems</li>
                  <li>• Computer Networks</li>
                </ul>
              </div>
            </div>

            <div className="border-l-2 border-muted pl-6 space-y-2">
              <h3 className="text-xl font-serif font-semibold">Honors & Awards</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Queen’s University Excellence Scholarship</li>
                <li>• OKBA Excellence Scholarship</li>
                <li>• Pitch Competition Winner - QTMA McKinsey Pitch Competition </li>
              </ul>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="grid gap-6">
            {sectionData.projects.map((project) => (
              <div key={project.id} className="border border-border rounded-lg p-6 hover:border-accent transition-smooth">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl text-accent font-bold">{project.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex-shrink-0">
                    <h3 className="text-2xl font-serif font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-secondary text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a href={`https://${project.link}`} className="text-accent hover:underline text-sm">
                      View on GitHub →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "techstack":
        // Technology slugs for Simple Icons (SimpleIcon slug format)
        const techSlugs = [
          // Languages
          "c",
          "cplusplus",
          "css3",
          "html5",
          "java",
          "javascript",
          "python",
          "ruby",
          "sqlite",
          "typescript",
          // Frameworks
          "django",
          "fastapi",
          "flask",
          "nextdotjs",
          "nodedotjs",
          "php",
          "react",
          "rubyonrails",
          "spring",
          // Developer Tools
          "amazonaws",
          "microsoftazure",
          "git",
          "apachehadoop",
          "mongodb",
          "postgresql",
          "powerbi",
          "tableau",
          "visualstudio",
          "docker",
          "kubernetes",
        ];

        return (
          <div className="w-full h-[600px] overflow-hidden rounded-lg">
            <IconCloud iconSlugs={techSlugs} />
          </div>
        );

      case "hobbies":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {sectionData.hobbies.map((hobby) => (
              <div key={hobby.id} className="border border-border rounded-lg p-6 hover:border-accent transition-smooth">
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                    {hobby.image ? (
                      <img src={hobby.image} alt={hobby.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl text-accent font-bold">{hobby.id}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold mb-3">{hobby.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{hobby.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "current":
        return (
          <div className="space-y-6">
            {/* Active Projects */}
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">Active Projects</h3>
              <div className="space-y-4">
                {sectionData.current.projects.map((project, index) => (
                  <div key={project.id} className={`border-l-2 ${index === 0 ? 'border-accent' : 'border-muted'} pl-4 space-y-2`}>
                    <h4 className="text-xl font-medium">{project.title}</h4>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-secondary text-xs rounded">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gym Progress */}
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">Gym Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                {sectionData.current.gymProgress.map((stat, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-accent">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Books I'm Reading */}
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">Currently Reading</h3>
              <div className="space-y-3">
                {sectionData.current.books.map((book, index) => (
                  <div key={book.id} className="flex gap-4 items-start">
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="w-16 h-24 object-contain rounded bg-accent/10" />
                    ) : (
                      <div className="flex-shrink-0 w-16 h-24 bg-gradient-to-br from-accent/20 to-accent/40 rounded"></div>
                    )}
                    <div>
                      <h4 className="text-lg font-medium">"{book.title}" by {book.author}</h4>
                      <p className="text-sm text-muted-foreground">{book.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Progress: {book.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Music */}
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">Music I'm Loving</h3>
              <div className="space-y-3">
                {sectionData.current.music.map((song, i) => (
                  <a 
                    key={i} 
                    href={song.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block border border-border rounded-lg p-4 hover:border-accent transition-smooth group"
                  >
                    <p className="text-base font-medium group-hover:text-accent">{song.title}</p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Other Interests */}
            <div>
              <h3 className="text-2xl font-serif font-semibold mb-4">Other Focus Areas</h3>
              <ul className="space-y-2 text-muted-foreground">
                {sectionData.current.focusAreas.map((area, i) => (
                  <li key={i}>• {area}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "extracurriculars":
        return (
          <div className="space-y-6">
            {sectionData.extracurriculars.map((activity, index) => (
              <div key={activity.id} className={`border-l-2 ${index === 0 ? 'border-accent' : 'border-muted'} pl-6 space-y-2`}>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    {activity.image ? (
                      <img src={activity.image} alt={activity.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl text-accent font-bold">{activity.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="text-2xl font-serif font-semibold">{activity.title}</h3>
                      <p className={index === 0 ? "text-accent font-medium" : "text-muted-foreground font-medium"}>{activity.organization}</p>
                      <span className="text-muted-foreground text-sm">{activity.period}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const openSection = (section: ConcreteSection) => {
    const container = gridRef.current;
    const card = cardRefs.current[section];

    if (!container || !card) {
      setVisibleSection(section);
      setOverlayStyle(null);
      setOverlayRadius(CONTAINER_RADIUS);
      setIsClosing(false);
      setShowContent(true);
      setCachedCardRect(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    
    // Start position - card position relative to container
    const startRect: OverlayRect = {
      top: cardRect.top - containerRect.top,
      left: cardRect.left - containerRect.left,
      width: cardRect.width,
      height: cardRect.height,
    };
    
    const cardRadius = parseFloat(window.getComputedStyle(card).borderRadius) || CONTAINER_RADIUS;

    // Cache the card position for smooth closing
    setCachedCardRect(startRect);

    // Set initial state - overlay starts at card size with no content
    setIsClosing(false);
    setShowContent(false);
    setOverlayStyle(startRect);
    setOverlayRadius(cardRadius);
    setVisibleSection(section);

    // Animate to full container size
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      // Animate to cover entire container
      setOverlayStyle({
        top: 0,
        left: 0,
        width: containerRect.width,
        height: containerRect.height,
      });
      setOverlayRadius(CONTAINER_RADIUS);
    });

    // Show content after expansion animation completes
    window.setTimeout(() => {
      setShowContent(true);
    }, ANIMATION_DURATION_MS + 50);
  };

  const closeSection = (section: ConcreteSection, onClosed?: () => void) => {
    const container = gridRef.current;
    
    if (!container || !cachedCardRect) {
      setVisibleSection(null);
      setOverlayStyle(null);
      setOverlayRadius(CONTAINER_RADIUS);
      setIsClosing(false);
      setShowContent(false);
      setCachedCardRect(null);
      onClosed?.();
      return;
    }

    const card = cardRefs.current[section];
    const cardRadius = card ? parseFloat(window.getComputedStyle(card).borderRadius) || CONTAINER_RADIUS : CONTAINER_RADIUS;

    // Hide content first
    setShowContent(false);
    setIsClosing(true);

    // Wait briefly for content to fade, then animate back to card position
    // The grid transition is happening at the same time
    window.setTimeout(() => {
      setOverlayStyle(cachedCardRect);
      setOverlayRadius(cardRadius);
    }, 100);

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    // Clean up after animation completes
    closeTimeoutRef.current = window.setTimeout(() => {
      setVisibleSection(null);
      setOverlayStyle(null);
      setOverlayRadius(CONTAINER_RADIUS);
      setIsClosing(false);
      setShowContent(false);
      setCachedCardRect(null);
      onClosed?.();
    }, ANIMATION_DURATION_MS + 100);
  };

  const handleCardClick = (section: Section) => {
    if (!section || isClosing) return;

    if (visibleSection === section) {
      closeSection(section);
      return;
    }

    if (visibleSection && visibleSection !== section) {
      closeSection(visibleSection as ConcreteSection, () => openSection(section as ConcreteSection));
      return;
    }

    openSection(section as ConcreteSection);
  };

  const handleClose = () => {
    if (!visibleSection || isClosing) return;
    closeSection(visibleSection as ConcreteSection);
  };

  return (
    <div className="h-screen overflow-y-auto bg-background min-h-screen flex flex-col">
      <header className="border-b flex-shrink-0 border-border bg-card/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border shadow-md">
                <img
                  src="/headshot.jpg"
                  alt="Kayne Lee headshot"
                  className="object-cover transition-all duration-700 ease-out scale-100 hover:scale-105"
                  sizes="64px"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-serif font-bold text-foreground">Kayne Lee</h1>
                <p className="text-muted-foreground max-w-xl">
                  Software Developer Intern @ IBM <br />
                  Computer Engineering @ Queen's University
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
              <a
                href="mailto:kayne.lee2@outlook.com"
                className="rounded-full border border-border px-4 py-2 transition-all duration-300 ease-out hover:border-accent hover:text-foreground"
              >
                kayne.lee2@outlook.com
              </a>
              <a
                href="https://www.linkedin.com/in/kaynelee"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-4 py-2 transition-all duration-300 ease-out hover:border-accent hover:text-foreground"
              >
                linkedin.com/in/kaynelee
              </a>
              <a
                href="https://github.com/kayne-lee"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-4 py-2 transition-all duration-300 ease-out hover:border-accent hover:text-foreground"
              >
                github.com/kayne-lee
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex-shrink-0">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-8 py-10">
          <div
            ref={gridRef}
            className="relative h-full overflow-hidden rounded-3xl border border-border bg-card/60 p-3 md:p-6 shadow-lg"
          >
            <div
              className={`grid h-full gap-3 md:gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr transition-all duration-500 ease-out ${
                visibleSection && !isClosing
                  ? "pointer-events-none scale-95 opacity-0"
                  : "pointer-events-auto scale-100 opacity-100"
              }`}
            >
              {sections.map((section) => {
                // Extract images from sectionData based on section type
                const getImages = () => {
                  switch(section.id) {
                    case 'experience':
                      return sectionData.experience.map(item => item.image);
                    case 'projects':
                      return sectionData.projects.map(item => item.image);
                    case 'hobbies':
                      return sectionData.hobbies.map(item => item.image);
                    case 'extracurriculars':
                      return sectionData.extracurriculars.map(item => item.image);
                    case 'current':
                      return []; // No image cascade for current section
                    default:
                      return [];
                  }
                };

                return (
                  <div
                    key={section.id}
                    ref={(node) => {
                      cardRefs.current[section.id] = node;
                    }}
                    className={`transition-all duration-500 ease-out rounded-[24px] ${
                      section.id === "experience" || section.id === "extracurriculars" ? "md:col-span-2 lg:col-span-2" : ""
                    }`}
                  >
                    <SectionCard
                      title={section.title}
                      metric={section.metric}
                      metricLabel={section.metricLabel}
                      icon={section.icon}
                      itemCount={section.itemCount}
                      images={getImages()}
                      onClick={() => handleCardClick(section.id)}
                    />
                  </div>
                );
              })}
            </div>

            {visibleSection && overlayStyle && (
              <div
                className={`absolute z-20 flex flex-col ${
                  showContent ? 'bg-card backdrop-blur-sm shadow-2xl' : ''
                } ${isClosing ? "pointer-events-none" : "pointer-events-auto"}`}
                style={{
                  top: overlayStyle.top,
                  left: overlayStyle.left,
                  width: overlayStyle.width,
                  height: overlayStyle.height,
                  borderRadius: overlayRadius,
                  backgroundColor: showContent ? 'hsl(var(--card))' : 'transparent',
                  border: showContent ? '1px solid hsl(var(--border))' : 'none',
                  padding: showContent ? '2rem' : '0',
                  transition: `top ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), left ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), width ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), height ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), border-radius ${ANIMATION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms, border 200ms, padding 200ms`,
                }}
              >
                {/* Only show content when expanded (not at card size) */}
                {showContent && (
                  <>
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div className="flex items-start gap-4">
                        {SectionIcon && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-sm">
                            <SectionIcon className="h-7 w-7 md:h-8 md:w-8" />
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-sm uppercase tracking-wide text-muted-foreground">
                            {currentSection?.metricLabel}
                          </p>
                          <h2 className="text-3xl font-serif font-semibold text-foreground">
                            {currentSection?.title}
                          </h2>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full border border-border p-2 text-muted-foreground transition-all duration-300 ease-out hover:border-accent hover:text-foreground"
                        aria-label="Close section"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="overflow-y-auto pr-2 text-foreground flex-1">
                      {renderSectionContent(visibleSection)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
