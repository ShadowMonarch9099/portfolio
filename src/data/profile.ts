/**
 * All site content lives here. Edit this file to update the portfolio;
 * components read from it and never hard-code content.
 */

export type SocialKind = "github" | "linkedin" | "email";

export interface SocialLink {
  kind: SocialKind;
  label: string;
  href: string;
}

export interface ExperienceProject {
  name: string;
  subtitle: string;
  period: string;
  /** Optional public URL, shown as a "Live" link. */
  liveUrl?: string;
  bullets: string[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  projects: ExperienceProject[];
}

export interface Project {
  slug: string;
  title: string;
  /** Short context line, e.g. where or why it was built. */
  context: string;
  period: string;
  description: string;
  /** Shown on the card (keep to 2–3). */
  highlights: string[];
  /** Shown in the detail dialog. */
  bullets: string[];
  tags: string[];
  /** Path under /public. Replace the file to swap the screenshot. */
  image: string;
  imageAlt: string;
  /** Leave undefined to hide the button. */
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillGroup {
  name: string;
  skills: string[];
  /** Featured groups get a larger, emphasised card. */
  featured?: boolean;
}

export interface Achievement {
  title: string;
  detail: string;
}

export interface Profile {
  name: string;
  initials: string;
  headline: string;
  subtext: string;
  location: string;
  /** Production URL, used for SEO metadata, sitemap and robots.txt. */
  siteUrl: string;
  seoDescription: string;
  resumeUrl: string;
  photo: string;
  photoAlt: string;
  email: string;
  socials: SocialLink[];
  about: string[];
  quickFacts: { label: string; value: string }[];
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  achievements: Achievement[];
  contact: { heading: string; text: string };
}

const email = "kush.honkalse@gmail.com";

export const profile: Profile = {
  name: "Kush Honkalse",
  initials: "KH",
  headline: "Frontend-focused Full-Stack Developer",
  subtext:
    "I build fast, polished web apps with React, Next.js and TypeScript, backed by solid Node.js and PostgreSQL APIs.",
  location: "Pune, India",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kush-honkalse.vercel.app",
  seoDescription:
    "Kush Honkalse is a frontend-focused full-stack developer building fast, polished web apps with React, Next.js, TypeScript, Node.js and PostgreSQL.",
  resumeUrl: "/Kush_Honkalse_Resume.pdf",
  photo: "/profile.jpg",
  photoAlt: "Portrait of Kush Honkalse",
  email,
  socials: [
    { kind: "github", label: "GitHub", href: "https://github.com/ShadowMonarch9099" },
    { kind: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/kush-honkalse-821421346" },
    { kind: "email", label: "Email", href: `mailto:${email}` },
  ],

  about: [
    "I'm a final-year B.E. student in Artificial Intelligence & Data Science at MMCOE (Savitribai Phule Pune University), graduating in May 2027 with a CGPA of 8.3/10.",
    "Over a six-month software engineering internship I shipped two production products, working across the frontend and the backend.",
    "What I care about most is frontend work: UI architecture, performance and user experience.",
  ],
  quickFacts: [
    { label: "CGPA", value: "8.3 / 10" },
    { label: "Graduating", value: "May 2027" },
    { label: "Internship", value: "6 months" },
    { label: "Products shipped", value: "2" },
  ],

  experience: [
    {
      role: "Software Engineering Intern",
      company: "ArrayPointer",
      location: "Pune",
      period: "Jan 2026 – Jul 2026",
      projects: [
        {
          name: "Meet",
          subtitle: "Multi-Tenant Meeting Intelligence SaaS",
          period: "Apr 2026 – Jul 2026",
          liveUrl: "https://meet.arraypointer.com",
          bullets: [
            "Built the React + TypeScript frontend (Vite, Tailwind CSS, React Router) for a production multi-tenant SaaS: organisation dashboards, session history, shared analysis views and invite flows, with state managed through the Context API and custom hooks.",
            "Engineered in-browser meeting recording with the WebAudio API and a chunk-streaming upload pipeline supporting pause/resume and zero data loss.",
            "Developed the Node.js/Express backend: a multi-tenant PostgreSQL schema and 25+ REST APIs for recording, organisation management, analytics and super-admin workflows, with secure sign-in and rate limiting.",
            "Delivered AI-generated transcripts, summaries and action items via AWS S3 and Lambda; deployed to production with Docker and Nginx.",
          ],
        },
        {
          name: "ThinkForge",
          subtitle: "Adaptive Learning Platform",
          period: "Jan 2026 – Mar 2026",
          bullets: [
            "Built a Next.js + TypeScript Progressive Web App styled with Tailwind CSS that serves one adaptive aptitude question daily, adjusting difficulty with a Bloom's Taxonomy-based skill-tracking algorithm.",
            "Developed Next.js API routes with Zod validation and PostgreSQL, integrating the Claude API to evaluate free-text answers and reasoning, with Redis for session state.",
            "Implemented authentication and push notifications, and shipped to production on Vercel.",
          ],
        },
      ],
    },
  ],

  projects: [
    {
      slug: "meet",
      title: "Meet",
      context: "ArrayPointer · Production",
      period: "Apr 2026 – Jul 2026",
      description: "A multi-tenant SaaS that records meetings in the browser and turns them into AI transcripts, summaries and action items.",
      highlights: [
        "React + TypeScript frontend with dashboards, session history and invite flows",
        "WebAudio recording with chunk-streaming uploads and pause/resume",
        "Node.js/Express backend with 25+ REST APIs on PostgreSQL",
      ],
      bullets: [
        "Built the React + TypeScript frontend (Vite, Tailwind CSS, React Router) for a production multi-tenant SaaS: organisation dashboards, session history, shared analysis views and invite flows, with state managed through the Context API and custom hooks.",
        "Engineered in-browser meeting recording with the WebAudio API and a chunk-streaming upload pipeline supporting pause/resume and zero data loss.",
        "Developed the Node.js/Express backend: a multi-tenant PostgreSQL schema and 25+ REST APIs for recording, organisation management, analytics and super-admin workflows, with secure sign-in and rate limiting.",
        "Delivered AI-generated transcripts, summaries and action items via AWS S3 and Lambda; deployed to production with Docker and Nginx.",
      ],
      tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "AWS"],
      image: "/projects/meet.png",
      imageAlt: "Screenshot of the Meet meeting intelligence dashboard",
      liveUrl: "https://meet.arraypointer.com",
    },
    {
      slug: "thinkforge",
      title: "ThinkForge",
      context: "ArrayPointer · Production",
      period: "Jan 2026 – Mar 2026",
      description: "An adaptive learning PWA that serves one aptitude question a day and adjusts difficulty to each learner.",
      highlights: [
        "Next.js + TypeScript Progressive Web App styled with Tailwind CSS",
        "Bloom's Taxonomy-based skill tracking that adapts difficulty",
        "Claude API evaluates free-text answers and reasoning",
      ],
      bullets: [
        "Built a Next.js + TypeScript Progressive Web App styled with Tailwind CSS that serves one adaptive aptitude question daily, adjusting difficulty with a Bloom's Taxonomy-based skill-tracking algorithm.",
        "Developed Next.js API routes with Zod validation and PostgreSQL, integrating the Claude API to evaluate free-text answers and reasoning, with Redis for session state.",
        "Implemented authentication and push notifications, and shipped to production on Vercel.",
      ],
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Zod", "Claude API", "Redis", "Vercel"],
      image: "/projects/thinkforge.png",
      imageAlt: "Screenshot of the ThinkForge daily question screen",
    },
    {
      slug: "kalasetu",
      title: "KalaSetu",
      context: "Smart India Hackathon 2026",
      period: "Sep 2026 – Present",
      description: "A voice-first platform that turns a photo and regional-language speech into an e-commerce listing for Indian artisans.",
      highlights: [
        "Photo + speech become a bilingual, priced, shareable listing",
        "Flutter app with GoRouter, Provider and 23-language support",
        "FastAPI integration for voice cataloguing, pricing and image studio",
      ],
      bullets: [
        "Turns a phone photo and regional-language speech into a bilingual (Hindi/English), priced, shareable e-commerce listing for low-literacy Indian artisans.",
        "Developed the Flutter mobile app across the full listing flow with GoRouter navigation, Provider state management and 23-language support.",
        "Integrated the app with a FastAPI backend for voice cataloguing (Sarvam speech-to-text/text-to-speech, Google Gemini), AI price suggestions and an image studio that removes backgrounds and checks colour accuracy.",
      ],
      tags: ["Flutter", "Dart", "FastAPI", "Python", "Gemini", "Sarvam AI", "Firebase"],
      image: "/projects/kalasetu.png",
      imageAlt: "Screenshots of the KalaSetu mobile app listing flow",
    },
  ],

  skills: [
    {
      name: "Frontend",
      featured: true,
      skills: [
        "React", "Next.js", "TypeScript", "JavaScript", "React Router", "Context API", "Tailwind CSS",
        "Vite", "Axios", "GSAP", "Three.js", "HTML5", "CSS3", "Responsive Design",
      ],
    },
    {
      name: "Backend",
      skills: ["Node.js", "Express.js", "FastAPI", "REST API Design", "Next.js API Routes", "Zod", "Vitest", "Supertest"],
    },
    { name: "Mobile", skills: ["Flutter", "React Native (Expo)"] },
    { name: "Databases", skills: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"] },
    { name: "Languages", skills: ["TypeScript", "JavaScript", "Python", "Dart", "C++", "SQL"] },
    { name: "Tools", skills: ["Git", "GitHub", "GitLab", "Vercel", "Postman"] },
    { name: "AI / ML", skills: ["LLM Integration (Claude, Gemini)", "Computer Vision", "HuggingFace"] },
  ],

  achievements: [
    { title: "Toycathon 2026", detail: "Qualified for Stage 3 of a national-level hackathon" },
    { title: "Smart India Hackathon", detail: "Participant in 2024, 2025 and 2026" },
    {
      title: "Technical Head, AESA MMCOE",
      detail: "Organised department technical events and mentored juniors on project development",
    },
    { title: "Certification", detail: "Full-Stack Web Development Bootcamp (Udemy)" },
  ],

  contact: {
    heading: "Let's build something together",
    text: "Open to software development internships and full-time roles.",
  },
};
