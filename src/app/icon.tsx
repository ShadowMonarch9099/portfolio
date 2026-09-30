import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** A small star in its gravity well: warm core on deep space. */
export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            background: "radial-gradient(circle at 40% 38%, #fff0dc 0%, #ffb07a 45%, #ff7a3d 100%)",
            boxShadow: "0 0 18px 4px rgba(255,122,61,0.55)",
          }}
        />
      </div>
    ),
    size,
  );
}
