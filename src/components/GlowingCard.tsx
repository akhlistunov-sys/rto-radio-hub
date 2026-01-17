import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

const GlowingCard = ({ 
  children, 
  className = "",
  glowColor = "hsl(var(--primary))",
  delay = 0
}: GlowingCardProps) => {
  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"
        style={{ background: `linear-gradient(45deg, ${glowColor}, transparent)` }}
      />
      
      {/* Card content */}
      <div className="relative glass-card p-6 rounded-2xl backdrop-blur-xl border border-border/50 bg-card/80">
        {children}
      </div>
    </motion.div>
  );
};

export default GlowingCard;
