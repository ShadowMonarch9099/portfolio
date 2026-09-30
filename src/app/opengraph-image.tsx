import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview: the hero line on deep space, with a star sinking into a grid. */
export default function OpengraphImage() {
  const lines = Array.from({ length: 13 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0c0b0a",
          color: "#efe9df",
          padding: 80,
          fontFamily: "serif",
        }}
      >
        {lines.map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 640 + i * 44,
              top: 0,
              width: 1,
              height: 630,
              background: "rgba(239,233,223,0.10)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 150,
            top: 170,
            width: 200,
            height: 200,
            borderRadius: 999,
            background: "radial-gradient(circle at 40% 38%, #fff0dc 0%, #ffb07a 45%, #ff7a3d 100%)",
            boxShadow: "0 0 140px 50px rgba(255,122,61,0.35)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760 }}>
          <div style={{ fontSize: 24, letterSpacing: 3, color: "#a39b8f", fontFamily: "monospace" }}>
            {`${profile.name.toUpperCase()} · ${profile.role.toUpperCase()}`}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, lineHeight: 1.02, letterSpacing: -2 }}>
            {profile.hero.lead}&nbsp;<span style={{ color: "#ff7a3d", fontStyle: "italic" }}>{profile.hero.emphasis}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
