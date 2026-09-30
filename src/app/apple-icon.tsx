import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0b0a",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            background: "radial-gradient(circle at 40% 38%, #fff0dc 0%, #ffb07a 45%, #ff7a3d 100%)",
            boxShadow: "0 0 50px 12px rgba(255,122,61,0.5)",
          }}
        />
      </div>
    ),
    size,
  );
}
