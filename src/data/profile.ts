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
  /** Still frame shown before a video plays. */
  poster?: string;
  /** Tall phone screenshots; shown side by side in a phone-shaped frame. */
  portrait?: boolean;
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  /** Shown as a stop on the home page and on the map. Everything else lives in the archive (/work). */
  featured?: boolean;
  /** Where/why it was built, e.g. "ArrayPointer internship". */
  context: string;
  period: string;
  role?: string;
  status: string;
  stack: string[];
  liveUrl?: string;
  /** Short intro shown on the home page and in the archive. */
  summary: string;
  /** "My part": three short points shown on the home page (featured projects). */
  highlights?: string[];
  /** One line on what the project taught me (featured projects). */
  takeaway?: string;
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
  /** Neon colour of this project's billboard in the 3D city (featured projects). */
  neon?: string;
  /** Small screenshot shown on the project's billboard (under /public). Leave out to show the title instead. */
  billboard?: string;
}

export interface SkillGroup {
  name: string;
  skills: string[];
  primary?: boolean;
  /** One line on where I've used this group. */
  note?: string;
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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://know-kush-honkalse.vercel.app",
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
    /** Shown small, then large, then huge: "I build the part of software / people actually / see." */
    lead: "I build the part of software",
    middle: "people actually",
    emphasis: "see.",
    intro:
      "Frontend developer from Pune and final-year AI & Data Science student, graduating May 2027. I care about three things: that it's fast, that it's easy to use, and that it looks right.",
    /** Explains the map in the background. */
    guide: "This page is a map. The route runs through the briefing first (work, projects, skills), then the story behind it, one stop at a time.",
  },

  /** The "player card" in the hero. `build` is how my focus splits between frontend and backend. */
  player: {
    class: "Frontend Developer",
    main: "React · Next.js · TypeScript",
    base: "Pune, India",
    openTo: "Full-time · Internships · Freelance",
    build: [
      { label: "Frontend", value: 70 },
      { label: "Backend", value: 30 },
    ],
  },

  /**
   * Bridges shown between stops, as a game dialogue box, so each section
   * leads into the next one. Keyed by the stop they lead into (see components/chapters.ts).
   * Act 1 (the briefing) comes first; `origin` is the save point between the two acts.
   */
  transitions: {
    experience: "Quick briefing first: where I've worked, what I built and what I use. The story comes after.",
    meet: "Six months at ArrayPointer, two products. This is the one that went live.",
    thinkforge: "Meet taught me how a whole product holds together. ThinkForge is where one of my own ideas ended up at the centre of one.",
    kalasetu: "Both of those were built for people sitting at a screen. The next one is for people who may never type a word.",
    "space-time-lab": "Not everything I build starts with a brief. Sometimes it starts with something I can't picture.",
    loadout: "Every one of those missions ran on the same loadout. Here's what I reach for first.",
    trophies: "Tools are one thing. Here's what they've earned so far.",
    origin: "That's the briefing. The rest is the player behind it, and every player has an origin story. Mine starts later than most.",
    values: "Building things taught me quickly that working isn't the same as finished.",
    offclock: "That's how I work. Here's what fills the rest of the day.",
    contact: "That's the run so far. The next level needs a second player.",
  } as Record<string, string>,

  /** The home page's link to the archive, after the featured missions. */
  archive: {
    teaser: "Four main missions on the map. The archive has every side mission too.",
    title: "Every mission, in one place.",
    intro: "The four main missions from the map, plus every side mission. Each one has a screenshot, the stack, and a debrief with the details.",
  },

  origin: {
    title: "I didn't write a single line of code until my first year of college.",
    body: [
      "No early head start. Programming reached me in my first year of engineering, through the curriculum and through my friends. Watching them build things made me want to build things too.",
      "I lean towards the frontend because I want to make the things people see, use and react to. I'm comfortable on the backend, but the interface is where I want to be.",
    ],
    /** "The run so far": milestones, oldest first. */
    timeline: [
      { when: "2023", what: "First year of engineering. First line of code." },
      { when: "2025", what: "Third year. Became Technical Head of AESA MMCOE." },
      { when: "Jan 2026", what: "Joined ArrayPointer as a software engineering intern. Built ThinkForge." },
      { when: "Mar 2026", what: "Built the Space-Time Lab for Toycathon 2026. It went on to reach Stage 3." },
      { when: "Apr 2026", what: "Started on Meet, which went live in production." },
      { when: "Sep 2026", what: "Started KalaSetu for Smart India Hackathon 2026." },
      { when: "May 2027", what: "Graduation. Next level: loading." },
    ],
  },

  values: {
    title: "Smooth sailing, every time.",
    intro: "Three things decide whether something I build is done. If one is missing, it isn't finished yet.",
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

  experienceIntro:
    "Working with people from the industry is clearly different from working on your own projects or in college. It's a different environment, with a different vibe.",

  experience: [
    {
      org: "ArrayPointer",
      role: "Software Engineering Intern",
      period: "Jan 2026 – Jul 2026",
      place: "Pune",
      summary:
        "Six months building two products end to end with a team: an adaptive learning app and a multi-tenant meeting intelligence SaaS. Mostly frontend, with a solid share of backend.",
      points: [
        "ThinkForge (Jan – Mar): built the Next.js app and its API, and proposed the level-detection system that became the core of the product.",
        "Meet (Apr – Jul): built the React frontend and the in-browser recorder, wrote a large part of the Node.js backend, and helped deploy it with Docker and Nginx.",
        "Spent a lot of my time on integration: merging, debugging and making everyone's pieces run as one product.",
      ],
    },
    {
      org: "MMCOE, Savitribai Phule Pune University",
      role: "B.E., Artificial Intelligence & Data Science",
      period: "Graduating May 2027",
      place: "Pune",
      summary: "CGPA 8.3 / 10. Final year, graduating May 2027.",
      points: [
        "Technical Head of AESA MMCOE in third year: ran the department's technical events and mentored juniors on their projects.",
        "Final-year project: Sakshya, a multilingual document search with page-level citations (in the archive).",
      ],
    },
  ],

  loadoutIntro: "Frontend is my main build. The rest is there when the job needs it.",

  skills: [
    {
      name: "Frontend",
      primary: true,
      skills: [
        "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "React Router", "Context API",
        "Vite", "GSAP", "Three.js", "React Three Fiber", "HTML5", "CSS3", "Responsive design",
      ],
    },
    {
      name: "Backend",
      note: "25+ REST APIs for Meet.",
      skills: ["Node.js", "Express.js", "FastAPI", "REST API design", "Next.js API routes", "Zod", "Vitest"],
    },
    { name: "Mobile", note: "Flutter for KalaSetu.", skills: ["Flutter", "React Native (Expo)"] },
    { name: "Data", note: "PostgreSQL in production on Meet.", skills: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"] },
    { name: "Languages", skills: ["TypeScript", "JavaScript", "Python", "Dart", "C++", "SQL"] },
    { name: "Tools", skills: ["Git", "GitHub", "GitLab", "Vercel", "Postman"] },
    {
      name: "AI / ML",
      note: "Claude in ThinkForge, Gemini in KalaSetu.",
      skills: ["LLM integration (Claude, Gemini)", "Computer vision", "HuggingFace"],
    },
  ] satisfies SkillGroup[],

  offClock: {
    title: "When I'm not coding, I'm probably gaming.",
    body: "Gaming is my biggest passion outside of code. I've played a lot of games over the years, and I'm confident in my skills. It's also where I learned what a good interface feels like.",
    /** Shown as a stat sheet. */
    stats: [
      { label: "Main quest", value: "Gaming" },
      { label: "Every day", value: "Anime" },
      { label: "Party", value: "Friends" },
    ],
    /** Spoken languages. `can` lists what's unlocked out of speak, read and write. */
    languages: [
      { name: "English", can: ["Speak", "Read", "Write"] },
      { name: "Hindi", can: ["Speak", "Read", "Write"] },
      { name: "Marathi", can: ["Speak", "Read", "Write"] },
      {
        name: "Japanese",
        can: ["Speak"],
        note: "Unlocked by watching a lot of anime. No courses, grammar not guaranteed, and I can't read or write it.",
      },
    ],
  },

  achievements: [
    { title: "Toycathon 2026", detail: "Qualified for Stage 3 of the national-level hackathon with the Space-Time Lab." },
    { title: "Shipped to production", detail: "Meet went live in production during my internship." },
    { title: "Smart India Hackathon", detail: "Took part three years running: 2024, 2025 and 2026." },
    { title: "Full-Stack Web Development", detail: "Completed the Udemy bootcamp certification." },
  ],

  now: "Right now I'm exploring machine learning. It's everywhere, so I want to understand how it works, not just call an API.",

  closing: {
    title: "Let's build something people notice.",
    body: "I'm open to full-time roles, internships and freelance projects. Frontend is where I do my best work, and I'm happy to handle the backend around it.",
    /** What a team gets. */
    offer: [
      { title: "Frontend first", body: "React, Next.js and TypeScript, with performance, ease of use and design treated as requirements." },
      { title: "Full stack when needed", body: "APIs, databases and deployment, done in production, not only in tutorials." },
      { title: "The one who makes it fit", body: "I'm used to taking everyone's branches and making them run as one product." },
      { title: "Best on what I care about", body: "Give me something I'm interested in and I'll go deep on it." },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Case studies                                                       */
/* ------------------------------------------------------------------ */

export const work: CaseStudy[] = [
  {
    slug: "meet",
    featured: true,
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
    highlights: [
      "Built the React frontend: organisation dashboards, session history, shared analysis and invites.",
      "Built the in-browser recorder, which streams audio in chunks so pausing and resuming never loses data.",
      "Wrote 25+ REST APIs on a multi-tenant PostgreSQL backend, and helped ship it with Docker and Nginx.",
    ],
    takeaway: "Integration is the real work. Getting several people's code to run as one product taught me more than any single feature.",
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
    cover: { src: "/work/meet/cover.jpg", alt: "Meet analytics dashboard for an organisation (sample data)" },
    gallery: [
      { src: "/work/meet/analysis.jpg", alt: "AI analysis of a meeting: summary, agenda coverage and action items (sample data)" },
      { src: "/work/meet/people.jpg", alt: "Organisation members and roles (sample data)" },
      { src: "/work/meet/landing.jpg", alt: "Meet Recorder landing page" },
    ],
    galleryPlaceholders: ["Organisation dashboard", "Recording in progress", "AI summary and action items"],
    neon: "#ff7a3d",
    billboard: "/work/meet/billboard.jpg",
  },
  {
    slug: "thinkforge",
    featured: true,
    title: "ThinkForge",
    tagline: "One aptitude question a day, pitched at exactly your level.",
    context: "ArrayPointer internship",
    period: "Jan – Mar 2026",
    role: "Full-stack developer",
    status: "Internship project",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Zod", "Claude API", "Redis"],
    summary:
      "An adaptive learning PWA that serves one question a day and adjusts to each learner. The level-detection logic at its core was my idea.",
    highlights: [
      "Proposed the \"proven floor\" level system at the heart of the app: your level only goes up, never down after one bad answer.",
      "Built the Next.js PWA around a single daily question, with authentication and push notifications.",
      "Connected Claude to grade free-text answers and the reasoning behind them.",
    ],
    takeaway: "A good idea doesn't need seniority. I suggested how learners should be levelled, and it became the core of the product.",
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
    cover: { src: "/work/thinkforge/cover.jpg", alt: "ThinkForge daily question, home screen and progress screen (sample data)" },
    gallery: [
      { src: "/work/thinkforge/home-question.jpg", alt: "Home screen with the daily challenge, and the question screen (sample data)" },
      { src: "/work/thinkforge/question.jpg", alt: "Daily question: identify the problem type before answering" },
      { src: "/work/thinkforge/progress.jpg", alt: "Weekly progress: XP, accuracy, topics and error patterns (sample data)" },
    ],
    galleryPlaceholders: ["Daily question", "Answer feedback", "Progress"],
    neon: "#ffd23d",
    billboard: "/work/thinkforge/billboard.jpg",
  },
  {
    slug: "kalasetu",
    featured: true,
    title: "KalaSetu",
    tagline: "A photo and a few spoken sentences become an online product listing.",
    context: "Smart India Hackathon 2026",
    period: "Sep 2026 – present",
    role: "Mobile app developer",
    status: "In development",
    stack: ["Flutter", "Dart", "GoRouter", "Provider", "FastAPI", "Python", "Google Gemini", "Sarvam AI", "Firebase"],
    summary:
      "A voice-first platform for Indian artisans with low literacy. I worked on the Flutter app and brought the team's work together into one working product.",
    highlights: [
      "Built the Flutter app across the whole listing flow, from capture to sharing.",
      "Translated the whole app into 23 languages: all 22 scheduled Indian languages plus English.",
      "Merged everyone's branches and the backend into one app that builds on every machine.",
    ],
    takeaway: "Designing for people who might not read or type changes every decision, starting with the first screen: pick your language, then just talk.",
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
    cover: {
      src: "/work/kalasetu/demo.mp4",
      kind: "video",
      poster: "/work/kalasetu/demo-poster.jpg",
      alt: "Demo of the KalaSetu web app: picking a language, signing in, photographing a product, describing it by voice in Hindi, and confirming the listing",
    },
    gallery: [
      { src: "/work/kalasetu/language.jpg", portrait: true, alt: "Mobile app: pick a language, or speak to detect it" },
      { src: "/work/kalasetu/onboarding.jpg", portrait: true, alt: "Artisan onboarding: scan an ID card to fill in registry details (sample data)" },
      { src: "/work/kalasetu/approval.jpg", portrait: true, alt: "Review the generated product card before it's listed (sample data)" },
      { src: "/work/kalasetu/distribution.jpg", portrait: true, alt: "Published listing, with WhatsApp sharing and marketplace sync (sample data)" },
    ],
    galleryPlaceholders: ["Language selection", "Capture and image studio", "Generated listing"],
    neon: "#5ee6d0",
    billboard: "/work/kalasetu/billboard.jpg",
  },
  {
    slug: "space-time-lab",
    featured: true,
    title: "Space-Time Lab",
    tagline: "A playable 3D sandbox that shows how mass bends spacetime.",
    context: "Toycathon 2026 · qualified for Stage 3",
    period: "Mar – Oct 2026",
    status: "Hackathon project",
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber", "Zustand", "Vite", "Framer Motion", "GSAP", "Tailwind CSS", "Web Workers", "Vitest", "Playwright"],
    summary:
      "A Toycathon 2026 entry: a sandbox where you run your own simulations and watch gravity warp spacetime. It reached Stage 3 of the national-level hackathon.",
    highlights: [
      "A spacetime grid that bends in real time as you drop in stars, planets and black holes.",
      "Six hands-on challenges, from reaching a stable orbit to surviving near a black hole.",
      "Quality settings from low to ultra, so it runs on any machine.",
    ],
    takeaway: "If you can play with an idea, you understand it. That's the whole point of the lab.",
    overview: [
      "Gravity is hard to picture. In the Space-Time Lab you drop stars, planets and black holes onto a grid and watch spacetime bend around them, then launch a rocket and see what that curvature does to its path.",
      "Since Toycathon it has grown into Cosmic Playground, built with my teammates Insiya and Srushti. The Spacetime Lab now runs real N-body gravity, and a second lab, the Rocket Lab, lets you set up a two-stage rocket, the weather and the planet, predict what will happen, then fly it.",
    ],
    built: {
      heading: "What's inside",
      points: [
        "A spacetime grid that deforms in real time using the inverse-square law: heavier, denser objects bend it further.",
        "A library of celestial objects (planets, stars, black holes, comets, asteroids, satellites and binary systems), each with its own mass and size.",
        "Time controls with rewind and replay, and a rocket launcher with a live trajectory preview.",
        "Six challenges to learn by doing: reach a stable orbit, escape a planet's gravity, pull off a gravity slingshot, land safely, stabilise a binary system and survive near a black hole.",
        "Advanced modes for three-body chaos, relativity, energy visualisation, dark matter and stability analysis, plus quality settings from low to ultra so it runs on any machine.",
        "Cosmic Playground: N-body physics in a Web Worker on a fixed time step, so a 64× time warp gives exactly the same result as 64 times as many frames, with tests to prove it.",
        "The Rocket Lab: eight weather conditions, a flight director and a launch coach that read live telemetry, and a mission report that explains every outcome with numbers.",
      ],
    },
    cover: { src: "/work/space-time-lab/cover.jpg", alt: "Space-Time Lab sandbox: a black hole, planets and a comet bending the spacetime grid" },
    gallery: [
      { src: "/work/space-time-lab/blackhole.jpg", alt: "A black hole's accretion disk and the grid curving around it" },
      { src: "/work/space-time-lab/modes.jpg", alt: "Advanced modes: three-body chaos, relativity, energy, dark matter and stability" },
      { src: "/work/space-time-lab/side-view.jpg", alt: "Side view of the sandbox with the object library and experiments panel" },
      { src: "/work/space-time-lab/cosmic-spacetime.jpg", alt: "Cosmic Playground: aiming a comet, with its predicted path showing it stays in orbit" },
      { src: "/work/space-time-lab/cosmic-rocket.jpg", alt: "Cosmic Playground's Rocket Lab: the mission report after a stable orbit, beside the flight director and launch coach" },
    ],
    galleryPlaceholders: ["Spacetime grid bending around a star", "Rocket trajectory preview", "Challenges panel"],
    neon: "#ff3d8b",
    billboard: "/work/space-time-lab/billboard.jpg",
  },

  /* Side missions: in the archive only. */
  {
    slug: "fathom",
    title: "Fathom",
    tagline: "Dive from the surface to the Mariana Trench, and log 141 real species on the way.",
    context: "Personal project",
    period: "Oct 2026",
    role: "Solo developer",
    status: "Live",
    stack: ["JavaScript", "HTML5 Canvas", "CSS3", "Web Audio API", "WoRMS, OBIS and Wikipedia data", "Vercel"],
    liveUrl: "https://deepseadive.vercel.app",
    summary:
      "A 2D pixel-art ocean exploration game that teaches marine biology without walls of text. Frontend only: plain HTML, CSS and JavaScript, with no framework and no build step.",
    overview: [
      "Fathom is a pixel-art submarine game. You dive from the sunlit surface to the bottom of the Mariana Trench, scan the animals you meet, and build your own field guide of 141 real species as you go.",
      "It's frontend only, with no framework and no build step. Progress saves in the browser, and a short save code carries it to another device without an account.",
    ],
    built: {
      heading: "What's inside",
      points: [
        "Five real ocean zones with true depth, pressure, temperature and sunlight readouts, from the coral reef and kelp forest by the shore down to a hydrothermal vent field and the Challenger Deep.",
        "Dithered pixel lighting: sunlight fades with depth, the headlights cut a cone through the dark, and bioluminescent animals glow on their own.",
        "A field guide built on real data: names and classification from WoRMS, sighting depths from OBIS, and summaries and photos from Wikipedia.",
        "Music, ambience and effects generated with the Web Audio API, so the game ships with no sound files.",
        "Keyboard, mouse, gamepad and touch controls, with settings for reduced motion, larger text and a high-contrast HUD.",
      ],
    },
    cover: { src: "/work/fathom/cover.jpg", alt: "Fathom: the submarine over the coral reef, surrounded by reef species" },
    gallery: [
      { src: "/work/fathom/title.jpg", alt: "Title screen: the research vessel and the sub at the surface, ready for a day or night dive" },
      { src: "/work/fathom/species-logged.jpg", alt: "Logging a new species: a scalloped hammerhead, with its field-guide card" },
      { src: "/work/fathom/hangar.jpg", alt: "The hangar: hull, battery, headlight, sonar, thruster and scanner upgrades" },
    ],
    galleryPlaceholders: ["Diving through the twilight zone", "Field guide", "Hangar upgrades"],
  },
  {
    slug: "kura",
    title: "Kura",
    tagline: "One ranked list of everything I've watched, with the official scores beside it.",
    context: "Personal project",
    period: "Oct 2026",
    role: "Solo developer",
    status: "In development",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "dnd-kit", "Vercel"],
    summary:
      "A personal ranking site, anime first, with MyAnimeList and AniList scores beside every entry. Friends can sign up, build their own lists, see their taste match and send each other recommendations.",
    overview: [
      "Kura started as one numbered list of every anime I've watched since 2020, with MyAnimeList and AniList scores beside each entry. It now ranks movies, series, games and music too, and friends can sign up and build their own lists.",
    ],
    built: {
      heading: "What's inside",
      points: [
        "Search with official scores, head-to-head ranking to place each new title, and drag to reorder.",
        "Filters by genre, format, length, decade and studio, with ranks like \"#3 in Romance · #41 overall\", and a view of where my list disagrees with MAL.",
        "A social layer: sign-up with email or Google, follows, friends-only lists, taste match, recommendations, reactions and comments.",
        "Watching now with episode progress and next-episode alerts, where to stream, and stats with a shareable year card.",
        "Separate rankings for movies, series, games and music, with scores from TMDB, OMDb, IGDB, OpenCritic, Steam, Spotify and Last.fm, cached and refreshed nightly.",
      ],
    },
    cover: { src: "/work/kura/cover.jpg", alt: "Kura's home page: the welcome screen beside a carousel of top picks by genre" },
    gallery: [
      { src: "/work/kura/ranking.jpg", alt: "The anime ranking, with MyAnimeList and AniList scores beside each entry" },
      { src: "/work/kura/title-page.jpg", alt: "A title page: my score and verdict, genres and the synopsis" },
      { src: "/work/kura/games.jpg", alt: "The games ranking, and the biggest gaps between my scores and OpenCritic's" },
    ],
    galleryPlaceholders: ["Ranked list with official scores", "Head-to-head placement", "Taste match"],
  },
  {
    slug: "pehno",
    title: "PEHNO",
    tagline: "Photograph your wardrobe. Get an outfit for the weather, the occasion and the festival.",
    context: "Personal project",
    period: "Apr – Sep 2026",
    role: "Full-stack developer",
    status: "In development",
    stack: ["React Native (Expo)", "TypeScript", "Zustand", "FastAPI", "Python", "PostgreSQL", "Redis", "Celery", "Next.js", "CLIP"],
    summary:
      "AI wardrobe intelligence for India. It digitises an Indian wardrobe (ethnic, fusion and western), classifies each garment with vision AI, and recommends outfits from live weather, occasions and the festival calendar.",
    overview: [
      "PEHNO (\"wear\" in Hindi) digitises an Indian wardrobe, from ethnic to western, and answers the daily question of what to wear. Each garment is classified by vision AI, and outfits are scored against the weather, the occasion, the festival calendar, fabric and weather rules, and personal style.",
    ],
    built: {
      heading: "What I built",
      points: [
        "The FastAPI backend (async SQLAlchemy, Alembic): OTP sign-in, wardrobe uploads and image processing, outfits, festivals, billing and an admin API, with tests running in CI.",
        "A garment classifier pipeline: colour extraction, a pluggable vision model (CLIP zero-shot for now) and rules for occasion, season, regional style and fabric care, with a correction loop that collects training data.",
        "An outfit engine with five scoring layers (weather, occasion, colour and skin tone, festival, personal taste), built on an Indian knowledge base of festivals, fabrics and occasions, including a Navratri nine-colour tracker.",
        "The React Native (Expo) app: onboarding, wardrobe, daily look, festivals and settings, with a web build for testing on a laptop.",
        "A Next.js admin dashboard for metrics, stylists, brands and festivals.",
      ],
    },
    cover: { src: "/work/pehno/cover.jpg", alt: "PEHNO's mobile app: the wardrobe, today's look for Pune's weather, and the festival calendar (test data)" },
    gallery: [
      { src: "/work/pehno/welcome.jpg", portrait: true, alt: "Welcome screen: AI wardrobe intelligence built for India" },
      { src: "/work/pehno/wardrobe.jpg", portrait: true, alt: "My wardrobe: AI-tagged garments with fabric and occasion (test data)" },
      { src: "/work/pehno/todays-look.jpg", portrait: true, alt: "Today's look, picked for the weather in Pune (test data)" },
      { src: "/work/pehno/festivals.jpg", portrait: true, alt: "Festival calendar: Navratri's nine colours, Dussehra and Diwali" },
    ],
    galleryPlaceholders: ["Daily look", "Wardrobe", "Festival tracker"],
  },
  {
    slug: "sakshya",
    title: "Sakshya",
    tagline: "Ask in English, Hindi or Marathi. Every answer cites its page, or there's no answer at all.",
    context: "B.E. final-year project · team of 2",
    period: "Sep 2026 – present",
    status: "In development",
    stack: ["Next.js", "TypeScript", "pdf.js", "FastAPI", "Python", "PostgreSQL", "pgvector", "Tesseract OCR", "multilingual-E5", "BM25"],
    summary:
      "A citation-grounded RAG system for private English, Hindi and Marathi documents, scans included. Every sentence of an answer cites its page, and when the documents don't hold the answer, it says so.",
    overview: [
      "Sakshya (\"evidence\") answers questions about private document collections in English, Hindi and Marathi: PDFs, Word files and scanned pages. Every sentence of an answer has to cite the page it came from. When the evidence isn't strong enough, it abstains and shows the nearest pages instead of guessing.",
      "It's our final-year B.E. project in AI & Data Science at MMCOE, built by a team of two.",
    ],
    built: {
      heading: "What's inside",
      points: [
        "Ingestion that reads each page from its text layer or with OCR (Tesseract, in Marathi, Hindi and English), and catches Devanagari text layers that look valid but aren't, such as legacy fonts.",
        "Page-anchored chunks, so every citation points to a real page, shown on the original document with the passage highlighted (pdf.js).",
        "Hybrid retrieval: multilingual-E5 vectors in pgvector and BM25 over words and character n-grams, with a router that picks a route for each question and a multilingual reranker.",
        "Questions in English, Hindi, Marathi or romanized text, with numbers and IDs matched exactly (१४२ and 142 are the same number).",
        "An evidence gate and a citation check: uncited sentences are removed, and every number in an answer must appear on a page it cites.",
      ],
    },
    cover: {
      src: "/work/sakshya/cover.jpg",
      alt: "An English question about a scanned Marathi land notice, answered with page citations and the passage highlighted on the original page",
    },
    gallery: [
      { src: "/work/sakshya/why-this-route.jpg", alt: "Technical details: why the router chose hybrid search, the question's features and each route's score" },
      { src: "/work/sakshya/document-analysis.jpg", alt: "How a document was read: file type check, OCR confidence, language mix and the extracted text" },
      { src: "/work/sakshya/documents.jpg", alt: "The three-pane layout: documents, conversation and the cited page" },
    ],
    galleryPlaceholders: ["Question with cited answer", "Cited page, highlighted", "Documents being read"],
  },
];

export function getCaseStudy(slug: string) {
  return work.find((w) => w.slug === slug);
}
