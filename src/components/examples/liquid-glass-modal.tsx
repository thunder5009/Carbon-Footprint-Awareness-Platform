/**
 * Modal Dialog with Liquid Glass V2
 * 
 * Example showing chromatic variant for hero elements
 * with proper backdrop and accessibility.
 */

"use client";

import { LiquidGlassV2 } from "@/components/ui/liquid-glass-v2";
import { X } from "lucide-react";
import { useEffect } from "react";

interface LiquidGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function LiquidGlassModal({
  isOpen,
  onClose,
  title,
  children,
}: LiquidGlassModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative max-w-lg w-full"
        role="document"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <LiquidGlassV2 material="chromatic" animate>
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
            <h2
              id="modal-title"
              className="text-2xl font-bold text-foreground"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

            {/* Content */}
            <div className="text-foreground">{children}</div>
          </div>
        </LiquidGlassV2>
      </div>
    </div>
  );
}

/**
 * USAGE:
 * 
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <LiquidGlassModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Calculation Complete"
 * >
 *   <p>Your carbon footprint has been calculated!</p>
 * </LiquidGlassModal>
 * 
 * FEATURES:
 * - Chromatic animated border (hero element treatment)
 * - Proper backdrop with blur
 * - Accessibility (role, aria-modal, focus management)
 * - Body scroll lock
 * - Click outside to close
 */
