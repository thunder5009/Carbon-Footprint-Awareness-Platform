"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface RevealItem {
  label: string;
  number: string;
  image: string;
  description: string;
}

interface HoverRevealListProps {
  items: RevealItem[];
  onItemClick?: (index: number) => void;
}

export function HoverRevealList({ items, onItemClick }: HoverRevealListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "40px",
        alignItems: "center",
        minHeight: "400px",
      }}
    >
      {/* Left: List */}
      <ul className="reveal-list">
        {items.map((item, i) => (
          <motion.li
            key={item.label}
            className="reveal-item"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onItemClick?.(i)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="reveal-item-link">
              <div
                style={{ display: "flex", alignItems: "baseline", gap: 24 }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#444",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: 32,
                  }}
                >
                  {item.number}
                </span>
                <span className="reveal-item-text">{item.label}</span>
              </div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#444", flexShrink: 0 }}
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Right: Image preview (fixed column with animated offset) */}
      <motion.div
        animate={{
          y: hoveredIndex !== null ? (hoveredIndex - (items.length - 1) / 2) * 40 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "sticky",
          top: "50%",
          marginTop: "-190px", // Centers vertically based on 380px height
          height: "380px",
          borderRadius: 20,
          overflow: "hidden",
          background: "#111",
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredIndex !== null ? (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={items[hoveredIndex].image}
                alt={items[hoveredIndex].label}
                fill
                style={{ objectFit: "cover" }}
                sizes="320px"
              />
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, transparent 60%)",
                }}
              />
              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 24,
                  right: 24,
                }}
              >
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  {items[hoveredIndex].label}
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.4,
                  }}
                >
                  {items[hoveredIndex].description}
                </p>
              </div>
            </motion.div>
          ) : (
            /* Default state — subtle prompt */
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ fontSize: "0.75rem", color: "#333" }}>
                Hover to preview
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
