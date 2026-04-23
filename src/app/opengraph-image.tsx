import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7fb",
          padding: "0 80px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#3b82f6",
            letterSpacing: "-3px",
            marginBottom: 28,
          }}
        >
          WSHKA
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "#132033",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.25,
            marginBottom: 20,
          }}
        >
          Вишлист с бронированием подарков
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 26,
            color: "#42546b",
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          Создай список · Поделись ссылкой · Получи нужный подарок
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
