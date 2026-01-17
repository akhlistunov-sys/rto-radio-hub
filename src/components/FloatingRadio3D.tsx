import { motion } from "framer-motion";

interface FloatingRadio3DProps {
  className?: string;
}

const FloatingRadio3D = ({ className = "" }: FloatingRadio3DProps) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1000px" }}>
      {/* 3D Radio Body */}
      <motion.div
        className="relative w-48 h-32 mx-auto"
        animate={{
          rotateY: [0, 10, 0, -10, 0],
          rotateX: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Main body */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-600">
          {/* Display screen */}
          <div className="absolute top-3 left-3 right-3 h-12 bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-lg border border-emerald-700 overflow-hidden">
            {/* Frequency display */}
            <motion.div
              className="h-full flex items-center justify-center font-mono text-emerald-400 text-xl font-bold"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              FM 89.0
            </motion.div>
            {/* Scan line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-300/40"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Dial */}
          <motion.div
            className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg border-2 border-amber-400"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1 left-1/2 w-0.5 h-3 bg-amber-900 -translate-x-1/2" />
          </motion.div>
          
          {/* Speaker grille */}
          <div className="absolute bottom-3 right-3 w-16 h-16 rounded-full bg-slate-900 grid grid-cols-4 grid-rows-4 gap-0.5 p-2">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full bg-slate-700"
                animate={{ 
                  scale: [1, 1.2, 1],
                  backgroundColor: ["rgb(51, 65, 85)", "rgb(100, 116, 139)", "rgb(51, 65, 85)"]
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            ))}
          </div>
          
          {/* Antenna */}
          <motion.div
            className="absolute -top-8 right-6 w-1 h-12 bg-gradient-to-t from-slate-500 to-slate-300 rounded-full origin-bottom"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </motion.div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl -z-10" />
      </motion.div>

      {/* Sound waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-2 border-primary/30 rounded-full"
            style={{
              width: 200 + i * 50,
              height: 200 + i * 50,
              left: -(100 + i * 25),
              top: -(100 + i * 25),
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingRadio3D;
