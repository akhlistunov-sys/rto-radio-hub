import { motion } from "framer-motion";

interface RadioWaveAnimationProps {
  className?: string;
  color?: string;
}

const RadioWaveAnimation = ({ className = "", color = "hsl(var(--primary))" }: RadioWaveAnimationProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Simple CSS-based radio waves - no framer-motion to prevent flickering */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border animate-pulse"
          style={{
            borderColor: color,
            borderWidth: 1,
            width: 200 + i * 150,
            height: 200 + i * 150,
            marginLeft: -(100 + i * 75),
            marginTop: -(100 + i * 75),
            opacity: 0.08,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  );
};

export default RadioWaveAnimation;
