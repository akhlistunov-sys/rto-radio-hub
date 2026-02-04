import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import FloatingRadio3D from "./FloatingRadio3D";
import SoundWaveVisualizer from "./SoundWaveVisualizer";
import RadioWaveAnimation from "./RadioWaveAnimation";

// Import logos
import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

const logos = [{
  src: logoRetro,
  name: "Ретро FM",
  freq: "89.0",
  description: "Лучшие хиты 70-х, 80-х и 90-х. Ностальгия по золотой эпохе советской и зарубежной эстрады."
}, {
  src: logoDacha,
  name: "Радио Дача",
  freq: "105.9",
  description: "Зажигательные песни для отдыха и хорошего настроения. Популярная музыка для дачи, дороги и души."
}, {
  src: logoHumor,
  name: "Юмор FM",
  freq: "93.9",
  description: "Смех — лучшее лекарство! Стендапы, юмористические шоу, пародии и позитив 24 часа в сутки."
}, {
  src: logoLove,
  name: "Love Radio",
  freq: "88.1 / 92.2",
  description: "Самые романтичные хиты о любви. Музыка для влюблённых и тех, кто хочет ими стать."
}, {
  src: logoShanson,
  name: "Радио Шансон",
  freq: "101.0",
  description: "Настоящий шансон. Баллады, городской романс и истории о жизни без прикрас."
}, {
  src: logoAutoradio,
  name: "Авторадио",
  freq: "105.3",
  description: "Музыка для тех, кто за рулём. Главные хиты, новости дорог и полезная информация для автомобилистов."
}];

interface ModernHeroSectionProps {
  onNavigate: (tab: string) => void;
}

const ModernHeroSection = ({
  onNavigate
}: ModernHeroSectionProps) => {
  const isMobile = useIsMobile();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const orbitRadius = isMobile ? 110 : 220;
  const logoSize = isMobile ? "w-16 h-16" : "w-28 h-28";

  return <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Radio Wave Animation - fills the hero section */}
      <RadioWaveAnimation className="opacity-40" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/30" style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }} animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.5, 1]
    }} transition={{
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      repeat: Infinity,
      ease: "easeInOut"
    }} />)}

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Ваш голос на
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-love-radio">
                  радиоволнах
                </span>
              </h1>
            </motion.div>

            <motion.p className="text-lg text-muted-foreground max-w-md" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.3
          }}>6 радиостанций, 15 000+ слушателей ежедневно. Размещаем рекламу в Ялуторовске и Заводоуковске.</motion.p>

            <motion.div className="flex flex-wrap gap-4" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }}>
              <Button size="lg" className="gap-2 text-base h-14 px-8" onClick={() => onNavigate("planner")}>
                <Sparkles className="w-5 h-5" />
                Магия ИИ
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8" onClick={() => onNavigate("about")}>
                Узнать больше
              </Button>
            </motion.div>

            {/* Sound wave */}
            <motion.div className="max-w-md" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.7
          }}>
              <SoundWaveVisualizer bars={30} className="h-12" />
            </motion.div>
          </div>

          {/* Right side - 3D Radio with larger logos */}
          <motion.div className="relative" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
            <FloatingRadio3D className="mb-12 scale-110" />
            
            {/* Orbiting logos - larger and more prominent */}
            <div className="relative h-80 mx-auto w-full max-w-lg">
              {logos.map((logo, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              return <motion.div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" initial={{
                opacity: 0,
                scale: 0
              }} animate={{
                opacity: 1,
                scale: 1,
                x: x,
                y: y
              }} transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.1
              }} whileHover={{
                scale: 1.2,
                zIndex: 10
              }}>
                    <div className="relative group cursor-pointer" onClick={() => setSelectedStation(selectedStation === i ? null : i)}>
                      <motion.img src={logo.src} alt={logo.name} className={`${logoSize} rounded-2xl bg-white p-2 shadow-xl object-contain border-2 border-white/50`} animate={{
                    y: [0, -8, 0]
                  }} transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }} />
                    </div>
                  </motion.div>;
            })}

              {/* Station description popup */}
              <AnimatePresence>
                {selectedStation !== null && (
                  <motion.div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-72 md:w-80"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="glass-card p-4 rounded-2xl shadow-2xl border border-primary/20">
                      <button 
                        onClick={() => setSelectedStation(null)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={logos[selectedStation].src} 
                          alt={logos[selectedStation].name}
                          className="w-12 h-12 rounded-xl bg-white p-1 object-contain"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{logos[selectedStation].name}</h3>
                          <p className="text-primary text-sm">{logos[selectedStation].freq} МГц</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{logos[selectedStation].description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{
      y: [0, 10, 0]
    }} transition={{
      duration: 2,
      repeat: Infinity
    }}>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div className="w-1.5 h-3 rounded-full bg-primary" animate={{
          y: [0, 12, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} />
        </div>
      </motion.div>
    </section>;
};
export default ModernHeroSection;