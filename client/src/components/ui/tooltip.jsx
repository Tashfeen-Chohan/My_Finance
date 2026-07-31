"use client";

import React, { useState } from "react";

export function Tooltip({ children, content, side = "top", className = "" }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  const sideClasses = {
    top: "bottom-full mb-1.5 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-1.5 left-1/2 -translate-x-1/2",
    left: "right-full mr-1.5 top-1/2 -translate-y-1/2",
    right: "left-full ml-1.5 top-1/2 -translate-y-1/2",
  };

  const toggle = (e) => {
    e.stopPropagation();
    setIsVisible((prev) => !prev);
  };

  return (
    <div
      className={`relative inline-flex max-w-full items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={toggle}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-normal rounded-xl bg-popover/95 border border-border/70 px-3 py-2 text-xs font-medium text-popover-foreground shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in-0 zoom-in-95 w-max max-w-[80vw] sm:max-w-md break-words ${
            sideClasses[side] || sideClasses.top
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
