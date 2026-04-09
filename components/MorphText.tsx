"use client";

import { useEffect, useState } from "react";

const phrases = [
  {
    text: "real work. intelligently matched.",
    highlight: "intelligently",
  },
  {
    text: "helping sme's find the right talent.",
    highlight: "right",
  },
];

export default function SmartText() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [index, setIndex] = useState(0);

  const current = phrases[index];
  const { text, highlight } = current;

  useEffect(() => {
  setVisibleCount(0);

  let i = 0;

  const typing = setInterval(() => {
    i++;

    setVisibleCount(i);

    if (i >= text.length) {
      clearInterval(typing);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 3000);
    }
  }, 100);

  return () => clearInterval(typing);
}, [index]);

  // 🔥 render char-by-char with glow logic
  const renderText = () => {
    const highlightStart = text.indexOf(highlight);
    const highlightEnd = highlightStart + highlight.length;

    return text.split("").map((char, i) => {
      if (i >= visibleCount) return null;

      const isHighlight = i >= highlightStart && i < highlightEnd;

      return (
        <span
          key={i}
          className={
            isHighlight
              ? "text-green-400 glow"
              : "text-white"
          }
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="text-5xl md:text-7xl font-semibold leading-tight h-[140px] mb-20">
      {renderText()}
      <span className="animate-pulse">|</span>
    </div>
  );
}