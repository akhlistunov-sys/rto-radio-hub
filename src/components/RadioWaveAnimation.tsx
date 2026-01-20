import { motion } from "framer-motion";

interface RadioWaveAnimationProps {
  className?: string;
  color?: string;
}

const RadioWaveAnimation = ({ className = "", color = "hsl(var(--primary))" }: RadioWaveAnimationProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Animated radio waves - larger and more proportional */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            borderColor: color,
            borderWidth: 2 - i * 0.15,
            width: 150 + i * 120,
            height: 150 + i * 120,
            marginLeft: -(75 + i * 60),
            marginTop: -(75 + i * 60),
          }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ 
            scale: [1, 1.8, 2.5],
            opacity: [0.5, 0.25, 0]
          }}
          transition={{
            duration: 4,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Additional subtle waves */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`secondary-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 60%, ${color} 100%)`,
            width: 200 + i * 150,
            height: 200 + i * 150,
            marginLeft: -(100 + i * 75),
            marginTop: -(100 + i * 75),
            opacity: 0.1,
          }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{
            duration: 3 + i,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default RadioWaveAnimation;
