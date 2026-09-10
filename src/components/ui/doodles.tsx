import React from "react";

interface SvgDoodleProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  color?: string;
}

/**
 * Hand-drawn curved arrow pointing down and to the right/left
 */
export function DoodleArrow({
  className = "w-12 h-12",
  color = "currentColor",
  direction = "right",
  ...props
}: SvgDoodleProps & { direction?: "right" | "left" | "down" | "curve-right" | "curve-left" }) {
  if (direction === "curve-right") {
    // Elegant swooping arrow curving down and pointing right
    return (
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M6 8C25 6 68 12 78 40"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 0"
        />
        <path
          d="M66 42C72 41 82 43 84 41C83 36 80 28 78 24"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (direction === "curve-left") {
    // Swooping arrow curving down and pointing left
    return (
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M94 8C75 6 32 12 22 40"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M34 42C28 41 18 43 16 41C17 36 20 28 22 24"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (direction === "down") {
    // Playful spiral / loop arrow pointing downward
    return (
      <svg
        viewBox="0 0 40 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M20 4C28 14 32 26 24 34C16 42 10 32 18 24C24 18 28 36 22 52C20 58 18 64 19 70"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M11 62L19 72L27 63"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default curve right
  return (
    <svg
      viewBox="0 0 70 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8 38C22 18 42 12 58 24"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M48 27L60 25L57 13"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn loose oval / scribble circle for highlighting words or numbers
 */
export function DoodleCircle({
  className = "w-full h-full",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M18 32C14 16 38 6 68 8C98 10 114 22 110 38C106 52 74 56 42 54C16 52 6 42 12 28C16 18 34 12 56 12"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn playful underline squiggle
 */
export function DoodleSquiggle({
  className = "w-28 h-4",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 140 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3 10C18 3 32 14 48 8C64 2 78 13 94 8C110 3 124 13 137 7"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Handcrafted 4-point botanical starburst / sparkle
 */
export function DoodleSparkle({
  className = "w-6 h-6",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M16 2C16 10 22 16 30 16C22 16 16 22 16 30C16 22 10 16 2 16C10 16 16 10 16 2Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Handcrafted botanical sprout doodle
 */
export function DoodleSprout({
  className = "w-8 h-8",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Stem */}
      <path
        d="M20 36C20 25 19 15 20 8"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Left Leaf */}
      <path
        d="M19 22C12 21 6 15 9 8C15 7 19 14 20 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Leaf */}
      <path
        d="M20 16C27 15 33 10 30 4C24 4 21 11 20 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Handcrafted morning sun rays doodle
 */
export function DoodleSunRays({
  className = "w-10 h-10",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="24" cy="24" r="9" stroke={color} strokeWidth="2.2" />
      <path
        d="M24 4V10M24 38V44M4 24H10M38 24H44M10 10L14 14M34 34L38 38M10 38L14 34M34 14L38 10"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn heart doodle for wellness and care
 */
export function DoodleHeart({
  className = "w-6 h-6",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M16 27C16 27 4 19 4 11C4 6.5 7.5 3 12 3C14.5 3 15.5 4.5 16 5.5C16.5 4.5 17.5 3 20 3C24.5 3 28 6.5 28 11C28 19 16 27 16 27Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-drawn checkmark doodle
 */
export function DoodleCheck({
  className = "w-5 h-5",
  color = "currentColor",
  ...props
}: SvgDoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 12.5L9.5 18L20 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Organic curved SVG wave divider for seamless editorial section transitions
 */
export function OrganicWaveDivider({
  fill = "currentColor",
  className = "w-full h-12 sm:h-16 text-canvas",
  inverted = false,
}: {
  fill?: string;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
        inverted ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C150,75 350,-25 500,45 C650,115 900,20 1200,60 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/**
 * Gentle curved wave divider for subtle transitions
 */
export function GentleWaveDivider({
  fill = "currentColor",
  className = "w-full h-10 sm:h-14 text-canvas",
  inverted = false,
}: {
  fill?: string;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
        inverted ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C300,90 600,10 900,70 C1050,100 1150,80 1200,60 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/**
 * Handwritten-style annotation label container with subtle rotation
 */
export function HandwrittenAnnotation({
  children,
  className = "",
  rotation = "-rotate-2",
  color = "text-forest-900",
}: {
  children: React.ReactNode;
  className?: string;
  rotation?: string;
  color?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-display italic font-semibold text-sm tracking-tight select-none transition-transform duration-200 hover:rotate-0 ${rotation} ${color} ${className}`}
    >
      {children}
    </span>
  );
}

