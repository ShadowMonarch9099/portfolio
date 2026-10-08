import { Hero } from "@/components/home/Hero";
import { Experience } from "@/components/home/Experience";
import { WorkStops } from "@/components/home/WorkStops";
import { Loadout } from "@/components/home/Loadout";
import { Trophies } from "@/components/home/Trophies";
import { Origin } from "@/components/home/Origin";
import { Principles } from "@/components/home/Principles";
import { OffClock } from "@/components/home/OffClock";
import { Closing } from "@/components/home/Closing";
import { Transit } from "@/components/home/Transit";
import { levelLabel } from "@/components/chapters";
import { JourneyTracker } from "@/components/JourneyTracker";
import { HUD } from "@/components/HUD";
import { Motion } from "@/components/Lazy";

/**
 * Two acts. The briefing comes first (experience, projects, skills,
 * achievements), so a recruiter gets what they came for up front; a save
 * point then hands over to the story behind it, ending at contact.
 */
export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        {/* Act I · The briefing */}
        <Transit to="experience" next={levelLabel("experience")} />
        <Experience />
        <WorkStops />
        <Transit to="loadout" next={levelLabel("loadout")} />
        <Loadout />
        <Transit to="trophies" next={levelLabel("trophies")} />
        <Trophies />
        {/* Act II · The player */}
        <Transit to="origin" next={levelLabel("origin")} savePoint />
        <Origin />
        <Transit to="values" next={levelLabel("principles")} />
        <Principles />
        <Transit to="offclock" next={levelLabel("off-clock")} />
        <OffClock />
        <Transit to="contact" next={levelLabel("contact", "Press start")} />
        <Closing />
      </main>
      <HUD />
      <JourneyTracker />
      <Motion />
    </>
  );
}
