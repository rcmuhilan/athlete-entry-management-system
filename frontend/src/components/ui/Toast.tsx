import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, XCircle, Info, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, duration = 5000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        onClose();
      }
    }, 10);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  const icons = {
    success: (
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-4 h-4 text-white stroke-[3]" />
      </div>
    ),
    error: (
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
        <X className="w-4 h-4 text-white stroke-[3]" />
      </div>
    ),
    info: (
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <Info className="w-4 h-4 text-white stroke-[3]" />
      </div>
    ),
  };

  const timerColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      className="pointer-events-auto relative overflow-hidden bg-white rounded-lg shadow-xl border border-gray-100 min-w-[320px] max-w-sm flex items-start gap-3 p-4"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>

      {/* Content */}
      <div className="flex-1 pr-6 pt-0.5">
        <p className="text-[#333333] text-sm leading-relaxed font-normal">
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Thick Progress Bar (Image matching) */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gray-50">
        <motion.div
          className={cn("h-full", timerColors[type])}
          style={{ width: `${progress}%` }}
          transition={{ type: "tween", ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};
