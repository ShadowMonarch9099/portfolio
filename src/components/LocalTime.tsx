"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/data/profile";

const format = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: profile.timeZone,
  timeZoneName: "short",
});

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/** Kush's local time, so visitors know when he's likely to reply. */
export function LocalTime() {
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(Date.now()).replace("GMT+5:30", "IST"),
    () => "IST",
  );
  return <time suppressHydrationWarning>{time}</time>;
}
