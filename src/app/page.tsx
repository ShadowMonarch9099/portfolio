import { About } from "@/components/About";
import { Achievements } from "@/components/Achievements";
import { Contact } from "@/components/Contact";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Motion } from "@/components/Motion";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { SkillsGrid } from "@/components/SkillsGrid";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <ExperienceTimeline />
        <Projects />
        <SkillsGrid />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
