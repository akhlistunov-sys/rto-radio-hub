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
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                Платформа радио активного маркетинга
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-love-radio">
                  для бизнеса
                </span>
              </h1>
            </motion.div>

            <motion.div className="space-y-3 max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <p className="text-base md:text-lg text-muted-foreground">
                Инструмент для планирования эффективного охвата в Ялуторовске и Заводоуковске
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">РТО — это 6 федеральных станций в одном окне.</span> Мы объединяем города в единую рекламную сеть и даём бизнесу прозрачные инструменты планирования.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Мы превращаем радиоэфир в измеримый маркетинговый канал.
              </p>
            </motion.div>

            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button size="lg" className="gap-2 text-base h-14 px-8" onClick={() => onNavigate("planner")}>
                <Sparkles className="w-5 h-5" />
                Магия ИИ
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8" onClick={() => onNavigate("calculator")}>
                Заказать рекламу
              </Button>
            </motion.div>

            {/* Sound wave */}
            <motion.div className="max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <SoundWaveVisualizer bars={30} className="h-12" />
            </motion.div>
          </div>

          {/* Right side - Radio + Logo grid */}
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FloatingRadio3D className="scale-100 md:scale-110" />
            
            {/* Logo grid 3x2 */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-sm md:max-w-md">
              {logos.map((logo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                  className="flex justify-center"
                >
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedStation(selectedStation === i ? null : i)}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl bg-white p-2 shadow-lg object-contain border-2 border-white/50 transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Station description popup */}
            <AnimatePresence>
              {selectedStation !== null && (
                <motion.div
                  className="w-full max-w-sm md:max-w-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="glass-card p-4 rounded-2xl shadow-2xl border border-primary/20 relative">
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
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div className="w-1.5 h-3 rounded-full bg-primary" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
};
export default ModernHeroSection;