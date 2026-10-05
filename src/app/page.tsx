import { Hero } from "@/components/home/Hero";
import { Origin } from "@/components/home/Origin";
import { Principles } from "@/components/home/Principles";
import { WorkStops } from "@/components/home/WorkStops";
import { Experience } from "@/components/home/Experience";
import { Loadout } from "@/components/home/Loadout";
import { OffClock } from "@/components/home/OffClock";
import { Closing } from "@/components/home/Closing";
import { Transit } from "@/components/home/Transit";
import { JourneyTracker } from "@/components/JourneyTracker";
import { HUD } from "@/components/HUD";
import { Motion } from "@/components/Lazy";

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Transit to="origin" next="LVL 01 · Origin" />
        <Origin />
        <Transit to="values" next="LVL 02 · Principles" />
        <Principles />
        <WorkStops />
        <Transit to="experience" next="LVL 04 · Quest log" />
        <Experience />
        <Transit to="loadout" next="LVL 05 · Loadout" />
        <Loadout />
        <Transit to="offclock" next="LVL 06 · Off the clock" />
        <OffClock />
        <Transit to="contact" next="LVL 07 · Press start" />
        <Closing />
      </main>
      <HUD />
      <JourneyTracker />
      <Motion />
    </>
  );
}
