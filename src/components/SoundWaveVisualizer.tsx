import { motion } from "framer-motion";

interface SoundWaveVisualizerProps {
  className?: string;
  bars?: number;
  color?: string;
}

const SoundWaveVisualizer = ({ 
  className = "", 
  bars = 20,
  color = "hsl(var(--primary))"
}: SoundWaveVisualizerProps) => {
  return (
    <div className={`flex items-end justify-center gap-1 h-16 ${className}`}>
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ height: 8 }}
          animate={{
            height: [
              8 + Math.random() * 20,
              8 + Math.random() * 50,
              8 + Math.random() * 30,
              8 + Math.random() * 40,
              8 + Math.random() * 20,
            ]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.05,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaveVisualizer;
