import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}: ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "radial-gradient(ellipse 60% 70% at 85% 0%, #2b2870 0%, #0a0a0f 70%)",
          color: "#ededf0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#818cf8",
              color: "#0a0a0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa" }}>{profile.location}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 44, marginTop: 24, color: "#818cf8" }}>{profile.headline}</div>
          <div style={{ fontSize: 28, marginTop: 28, color: "#a1a1aa", maxWidth: 900, lineHeight: 1.4 }}>
            React · Next.js · TypeScript · Node.js · PostgreSQL
          </div>
        </div>
      </div>
    ),
    size,
  );
}
