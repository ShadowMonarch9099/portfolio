import { Hero } from "@/components/home/Hero";
import { Origin } from "@/components/home/Origin";
import { Principles } from "@/components/home/Principles";
import { WorkStops } from "@/components/home/WorkStops";
import { Experience } from "@/components/home/Experience";
import { Loadout } from "@/components/home/Loadout";
import { OffClock } from "@/components/home/OffClock";
import { Closing } from "@/components/home/Closing";
import { JourneyTracker } from "@/components/JourneyTracker";
import { HUD } from "@/components/HUD";
import { Motion } from "@/components/Lazy";

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Origin />
        <Principles />
        <WorkStops />
        <Experience />
        <Loadout />
        <OffClock />
        <Closing />
      </main>
      <HUD />
      <JourneyTracker />
      <Motion />
    </>
  );
}
