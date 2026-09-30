/**
 * All site content lives here. Edit this file to update the portfolio;
 * components read from it and never hard-code content.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface Media {
  /** Path under /public, e.g. "/work/meet/cover.jpg". */
  src: string;
  alt: string;
  /** Set to "video" for .mp4/.webm files. */
  kind?: "image" | "video";
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  /** Where/why it was built, e.g. "ArrayPointer internship". */
  context: string;
  period: string;
  role?: string;
  status: string;
  stack: string[];
  liveUrl?: string;
  /** Short intro shown on the home page. */
  summary: string;
  /** Case-study sections. Omit any that don't apply. */
  overview: string[];
  built: { heading: string; points: string[] };
  challenge?: { heading: string; body: string[] };
  decision?: { heading: string; body: string[] };
  /** Screenshots and videos. Leave empty to show designed placeholders. */
  cover?: Media;
  gallery: Media[];
  /** Placeholder labels for the gallery until real media is added. */
  galleryPlaceholders: string[];
  /** Colour of this project's planet in the 3D scene. */
  planet: { color: string; glow: string; kind: "planet" | "ringed" | "blackhole" };
}

export interface SkillGroup {
  name: string;
  skills: string[];
  primary?: boolean;
}

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */

export const profile = {
  name: "Kush Honkalse",
  firstName: "Kush",
  role: "Frontend Developer",
  location: "Pune, India",
  timeZone: "Asia/Kolkata",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kush-honkalse.vercel.app",
  seoTitle: "Kush Honkalse · Frontend Developer",
  seoDescription:
    "Kush Honkalse is a frontend developer from Pune who builds fast, easy-to-use interfaces with React, Next.js and TypeScript.",
  resumeUrl: "/Kush_Honkalse_Resume.pdf",
  photo: { src: "/kush.jpg", alt: "Kush Honkalse in a dark suit, arms folded, smiling outdoors" },

  contact: {
    email: "kush.honkalse@gmail.com",
    phone: "+919960053725",
    phoneDisplay: "+91 99600 53725",
    linkedin: "https://linkedin.com/in/kush-honkalse-821421346",
  },

  hero: {
    lead: "I build the part of software people actually",
    emphasis: "see.",
    intro:
      "Frontend developer from Pune. I care about three things: that it's fast, that it's easy to use, and that it looks right. Final-year AI & Data Science student, graduating May 2027.",
  },

  origin: {
    title: "I didn't write a single line of code until my first year of college.",
    body: [
      "Programming reached me through the curriculum, and through my friends. Watching the people around me build things made me want to build things too, and that curiosity opened up a whole new world.",
      "I lean towards the frontend because I want to make things people can see, use and react to, not work that stays in the shadows. I do backend work too, and I'm comfortable there, but the interface is where I want to be.",
    ],
    facts: [
      { label: "Studying", value: "B.E. AI & Data Science, MMCOE" },
      { label: "Graduating", value: "May 2027 · CGPA 8.3" },
      { label: "Based in", value: "Pune, India" },
    ],
  },

  values: {
    title: "Smooth sailing, every time.",
    intro: "Three things decide whether something I build is done.",
    items: [
      { name: "Performance", body: "If it stutters, it isn't finished. Pages should load fast and every interaction should feel instant." },
      { name: "Ease of use", body: "Nobody should need instructions. The interface should make sense the first time you see it." },
      { name: "Design", body: "How it looks is part of how it works. Polish is part of the job, not decoration on top." },
    ],
    pull: {
      title: "What pulls me in",
      body: "I do my best work on things I'm genuinely interested in. When the work lines up with what I'm passionate about, even better.",
    },
  },

  experience: [
    {
      org: "ArrayPointer",
      role: "Software Engineering Intern",
      period: "Jan 2026 – Jul 2026",
      place: "Pune",
      summary:
        "Six months building two products end to end: Meet, a multi-tenant meeting intelligence SaaS, and ThinkForge, an adaptive learning app. Mostly frontend, with a solid share of backend.",
    },
    {
      org: "MMCOE, Savitribai Phule Pune University",
      role: "B.E., Artificial Intelligence & Data Science",
      period: "Graduating May 2027",
      place: "Pune",
      summary: "CGPA 8.3 / 10. Technical Head of AESA MMCOE.",
    },
  ],

  skills: [
    {
      name: "Frontend",
      primary: true,
      skills: [
        "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "React Router", "Context API",
        "Vite", "GSAP", "Three.js", "React Three Fiber", "HTML5", "CSS3", "Responsive design",
      ],
    },
    { name: "Backend", skills: ["Node.js", "Express.js", "FastAPI", "REST API design", "Next.js API routes", "Zod", "Vitest"] },
    { name: "Mobile", skills: ["Flutter", "React Native (Expo)"] },
    { name: "Data", skills: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"] },
    { name: "Languages", skills: ["TypeScript", "JavaScript", "Python", "Dart", "C++", "SQL"] },
    { name: "Tools", skills: ["Git", "GitHub", "GitLab", "Vercel", "Postman"] },
    { name: "AI / ML", skills: ["LLM integration (Claude, Gemini)", "Computer vision", "HuggingFace"] },
  ] satisfies SkillGroup[],

  offClock: {
    title: "When I'm not coding, I'm probably gaming.",
    body: [
      "Gaming is my biggest passion outside of code. I've played a lot of games over the years, and I'm confident in my skills.",
      "Anime is part of my daily routine, and the rest of the time I'm usually hanging out with friends.",
    ],
  },

  achievements: [
    { title: "Toycathon 2026", detail: "Qualified for Stage 3 of the national-level hackathon with the Space-Time Lab." },
    { title: "Smart India Hackathon", detail: "Participated in 2024, 2025 and 2026." },
    { title: "Technical Head, AESA MMCOE", detail: "Ran department technical events and mentored juniors on their projects." },
    { title: "Full-Stack Web Development", detail: "Completed the Udemy bootcamp certification." },
  ],

  now: "Right now I'm exploring machine learning. It's at the heart of my final-year project, and it's everywhere right now, so I want to understand it properly.",

  closing: {
    title: "Let's build something people notice.",
    body: "I'm open to frontend roles and internships, and to anything where I get to build the part people see.",
  },
};

/* ------------------------------------------------------------------ */
/* Case studies                                                       */
/* ------------------------------------------------------------------ */

export const work: CaseStudy[] = [
  {
    slug: "meet",
    title: "Meet",
    tagline: "Record a meeting in the browser. Get the transcript, summary and action items.",
    context: "ArrayPointer internship",
    period: "Apr – Jul 2026",
    role: "Frontend-led full-stack developer",
    status: "Live in production",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "React Router", "Node.js", "Express", "PostgreSQL", "AWS S3", "AWS Lambda", "Docker", "Nginx"],
    liveUrl: "https://meet.arraypointer.com",
    summary:
      "A multi-tenant meeting intelligence SaaS. I built the React frontend and the in-browser recorder, plus a large part of the Node.js backend.",
    overview: [
      "Meet lets a team record meetings straight from the browser and get back AI-generated transcripts, summaries and action items. Each organisation gets its own space, with dashboards, session history and shareable analysis.",
      "I worked across the product, with most of my time on the frontend: the interface people use every day and the recorder that has to work every single time.",
    ],
    built: {
      heading: "What I built",
      points: [
        "The React + TypeScript frontend (Vite, Tailwind CSS, React Router): organisation dashboards, session history, shared analysis views and invite flows, with state managed through the Context API and custom hooks.",
        "In-browser meeting recording on the WebAudio API, with a chunk-streaming upload pipeline that supports pause/resume without losing data.",
        "The Node.js/Express backend: a multi-tenant PostgreSQL schema and 25+ REST APIs for recording, organisation management, analytics and super-admin workflows, with secure sign-in and rate limiting.",
        "The AI pipeline hand-off through AWS S3 and Lambda, and production deployment with Docker and Nginx.",
      ],
    },
    challenge: {
      heading: "The hard part: making it all fit together",
      body: [
        "No single feature was the hardest part. Integration was. Several of us were building pieces of the same product at the same time, and getting them to work as one meant a lot of debugging, merging and resolving conflicts.",
        "Working as a team was never the problem. Stitching everyone's work into one product that runs smoothly was, and it taught me more than any single feature did.",
      ],
    },
    gallery: [],
    galleryPlaceholders: ["Organisation dashboard", "Recording in progress", "AI summary and action items"],
    planet: { color: "#e8683a", glow: "#ff9a5c", kind: "planet" },
  },
  {
    slug: "thinkforge",
    title: "ThinkForge",
    tagline: "One aptitude question a day, pitched at exactly your level.",
    context: "ArrayPointer internship",
    period: "Jan – Mar 2026",
    role: "Full-stack developer",
    status: "Internship project",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Zod", "Claude API", "Redis"],
    summary:
      "An adaptive learning PWA that serves one question a day and adjusts to each learner. The level-detection logic at its core was my idea.",
    overview: [
      "ThinkForge is a Progressive Web App that gives students one aptitude question a day. They answer in their own words, AI checks their reasoning, and the next question adapts to how they're doing.",
    ],
    built: {
      heading: "What I built",
      points: [
        "A Next.js + TypeScript PWA styled with Tailwind CSS, built around a single daily question.",
        "Next.js API routes with Zod validation and PostgreSQL, integrating the Claude API to evaluate free-text answers and reasoning, with Redis for session state.",
        "Authentication and push notifications.",
      ],
    },
    decision: {
      heading: "The decision I'm proudest of",
      body: [
        "The way ThinkForge works out a learner's level was my suggestion. Instead of a score that swings up and down with every answer, each learner has a proven floor: the highest level they've actually demonstrated, based on Bloom's Taxonomy.",
        "The floor only moves up (Easy, then Medium, Hard and Advanced) and never drops because of a single wrong answer. Learners always get questions that match what they've proven they can do, and a bad day doesn't undo their progress.",
      ],
    },
    gallery: [],
    galleryPlaceholders: ["Daily question", "Answer feedback", "Progress"],
    planet: { color: "#d9b44a", glow: "#ffd98a", kind: "ringed" },
  },
  {
    slug: "kalasetu",
    title: "KalaSetu",
    tagline: "A photo and a few spoken sentences become an online product listing.",
    context: "Smart India Hackathon 2026",
    period: "Sep 2026 – present",
    role: "Mobile app developer",
    status: "In development",
    stack: ["Flutter", "Dart", "GoRouter", "Provider", "FastAPI", "Python", "Google Gemini", "Sarvam AI", "Firebase"],
    summary:
      "A voice-first platform for Indian artisans with low literacy. I worked on the Flutter app and brought the team's work together into one working product.",
    overview: [
      "Many artisans can't write product descriptions in English or Hindi, or price their work for online buyers. With KalaSetu, an artisan takes a photo and describes the product out loud in their own language. The app turns that into a bilingual (Hindi/English), priced listing they can share.",
    ],
    built: {
      heading: "What I built",
      points: [
        "The Flutter mobile app across the full listing flow: language, onboarding, capture, AI insights, approval and distribution, with GoRouter navigation and Provider state management.",
        "Support for 23 languages: all 22 scheduled Indian languages plus English. Picking a language translates the whole app.",
        "The connection to the FastAPI backend for voice cataloguing (Sarvam speech-to-text and text-to-speech, Google Gemini), AI price suggestions, and an image studio that removes backgrounds and checks colour accuracy.",
      ],
    },
    challenge: {
      heading: "The hard part: one app from many branches",
      body: [
        "Different teammates built different screens on their own branches. I merged them into a single app, brought in the backend code, and fixed what broke along the way, including matching everyone's Flutter SDK and Gradle versions so the project built on every machine.",
      ],
    },
    gallery: [],
    galleryPlaceholders: ["Language selection", "Capture and image studio", "Generated listing"],
    planet: { color: "#4f9d7e", glow: "#8fdcb8", kind: "planet" },
  },
  {
    slug: "space-time-lab",
    title: "Space-Time Lab",
    tagline: "A playable 3D sandbox that shows how mass bends spacetime.",
    context: "Toycathon 2026 · qualified for Stage 3",
    period: "Mar 2026",
    status: "Hackathon project",
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber", "Zustand", "Framer Motion", "Vite"],
    summary:
      "A Toycathon 2026 entry: a sandbox where you run your own simulations and watch gravity warp spacetime. It reached Stage 3 of the national-level hackathon.",
    overview: [
      "Gravity is hard to picture. In the Space-Time Lab you drop stars, planets and black holes onto a grid and watch spacetime bend around them, then launch a rocket and see what that curvature does to its path.",
      "The spacetime grid in the background of this site is a nod to it.",
    ],
    built: {
      heading: "What's inside",
      points: [
        "A spacetime grid that deforms in real time using the inverse-square law: heavier, denser objects bend it further.",
        "A library of celestial objects (planets, stars, black holes, comets, asteroids, satellites and binary systems), each with its own mass and size.",
        "Time controls with rewind and replay, and a rocket launcher with a live trajectory preview.",
        "Six challenges to learn by doing: reach a stable orbit, escape a planet's gravity, pull off a gravity slingshot, land safely, stabilise a binary system and survive near a black hole.",
        "Advanced modes for three-body chaos, relativity, energy visualisation, dark matter and stability analysis, plus quality settings from low to ultra so it runs on any machine.",
      ],
    },
    gallery: [],
    galleryPlaceholders: ["Spacetime grid bending around a star", "Rocket trajectory preview", "Challenges panel"],
    planet: { color: "#15131a", glow: "#ff8a4c", kind: "blackhole" },
  },
];

export function getCaseStudy(slug: string) {
  return work.find((w) => w.slug === slug);
}
