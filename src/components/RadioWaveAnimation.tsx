import { motion } from "framer-motion";

interface RadioWaveAnimationProps {
  className?: string;
  color?: string;
}

const RadioWaveAnimation = ({ className = "", color = "hsl(var(--primary))" }: RadioWaveAnimationProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Animated radio waves */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border-2"
          style={{
            borderColor: color,
            width: 100 + i * 80,
            height: 100 + i * 80,
            marginLeft: -(50 + i * 40),
            marginTop: -(50 + i * 40),
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ 
            scale: [1, 2, 3],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default RadioWaveAnimation;
