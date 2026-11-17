import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #144518 0%, #15803D 100%)",
          borderRadius: "8px",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Botanical droplet & leaf silhouette */}
          <path
            d="M12 2.5C12 2.5 5.5 9.5 5.5 14.2C5.5 17.95 8.41 21 12 21C15.59 21 18.5 17.95 18.5 14.2C18.5 9.5 12 2.5 12 2.5Z"
            fill="#FDFCF7"
          />
          <path
            d="M12 7.5C12 7.5 15.5 11.2 15.5 14.3C15.5 16.3 13.93 17.9 12 17.9C10.07 17.9 8.5 16.3 8.5 14.3C8.5 11.2 12 7.5 12 7.5Z"
            fill="#22C55E"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
