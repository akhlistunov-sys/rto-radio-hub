import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Phone, Mail, Send, Play, Pause, Volume2, ArrowDown, Zap, Users, Radio, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import logos
import logoRTO from "@/assets/logo-rto.png";
import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

const radioStations = [
  { 
    name: "Ретро FM", 
    freq: "89.0", 
    logo: logoRetro, 
    color: "#C8208E",
    audience: "30–55 лет",
    description: "Ностальгические хиты, вызывающие сильный эмоциональный отклик",
    reach: "25 000+"
  },
  { 
    name: "Радио Дача", 
    freq: "105.9", 
    logo: logoDacha, 
    color: "#3BA4D8",
    audience: "35–65 лет",
    description: "Семейный формат, ориентированный на уют и спокойствие",
    reach: "30 000+"
  },
  { 
    name: "Юмор FM", 
    freq: "93.9", 
    logo: logoHumor, 
    color: "#FACC15",
    audience: "25–45 лет",
    description: "Позитив и смех для активных слушателей",
    reach: "20 000+"
  },
  { 
    name: "Love Radio", 
    freq: "88.1 / 92.2", 
    logo: logoLove, 
    color: "#E73335",
    audience: "18–35 лет",
    description: "Драйвовая и романтичная станция для молодёжи",
    reach: "35 000+"
  },
  { 
    name: "Шансон", 
    freq: "101.0", 
    logo: logoShanson, 
    color: "#1E3A8A",
    audience: "30–60 лет",
    description: "Честные истории для мужской аудитории",
    reach: "22 000+"
  },
  { 
    name: "Авторадио", 
    freq: "105.3", 
    logo: logoAutoradio, 
    color: "#E73335",
    audience: "25–50 лет",
    description: "Музыка и новости для автомобилистов",
    reach: "28 000+"
  },
];

const CreativeIndex = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="bg-background text-foreground overflow-x-hidden">
      {/* Fixed Minimal Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div 
            className="text-2xl font-black text-white tracking-tighter"
            whileHover={{ scale: 1.05 }}
          >
            РТО
          </motion.div>
          <div className="flex items-center gap-8 text-white text-sm font-medium">
            <a href="tel:+73453550151" className="hidden md:flex items-center gap-2 hover:opacity-60 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>5-01-51</span>
            </a>
            <a href="https://t.me/YaRadioBot" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
              <Send className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Full Screen Statement */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-foreground text-background"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[...Array(20)].map((_, i) => (
              <motion.circle
                key={i}
                cx={50}
                cy={50}
                r={5 + i * 5}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-background/10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Main Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <motion.p 
              className="text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-8 opacity-60"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Рекламное агентство
            </motion.p>
            
            <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.85] tracking-tight">
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                ЗВУК,
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                КОТОРЫЙ
              </motion.span>
              <motion.span 
                className="block text-primary"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                ПРОДАЁТ
              </motion.span>
            </h1>

            <motion.div 
              className="flex flex-wrap gap-6 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <Radio className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs opacity-60">радиостанций</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-current/20 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">150K+</p>
                  <p className="text-xs opacity-60">слушателей в день</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-current/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs opacity-60">города охвата</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 opacity-40" />
        </motion.div>

        {/* Radio Logos Floating */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
          {radioStations.map((station, i) => (
            <motion.div
              key={station.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              whileHover={{ scale: 1.2, x: -10 }}
              className="w-12 h-12 rounded-lg bg-background p-1 cursor-pointer shadow-xl"
              onClick={() => setActiveStation(i)}
            >
              <img src={station.logo} alt={station.name} className="w-full h-full object-contain" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Radio Stations Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">Наши волны</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Каждая станция — уникальная аудитория. Выберите тех, кто услышит вашу рекламу.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {radioStations.map((station, i) => (
              <motion.div
                key={station.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 border-border cursor-pointer transition-all duration-500 overflow-hidden",
                  activeStation === i ? "border-primary bg-primary/5" : "hover:border-primary/50"
                )}
                onClick={() => setActiveStation(activeStation === i ? null : i)}
                style={{
                  background: activeStation === i ? `linear-gradient(135deg, ${station.color}10, transparent)` : undefined
                }}
              >
                {/* Background Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${station.color}, transparent 70%)` }}
                />

                <div className="relative flex items-start gap-4">
                  <motion.div 
                    className="w-16 h-16 rounded-xl bg-white p-2 shadow-lg flex-shrink-0"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <img src={station.logo} alt={station.name} className="w-full h-full object-contain" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold truncate">{station.name}</h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: station.color, color: 'white' }}
                      >
                        {station.freq} FM
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{station.audience}</p>
                    
                    <AnimatePresence>
                      {activeStation === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm mb-3">{station.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{station.reach}</span>
                            </div>
                            <Button size="sm" variant="outline">
                              Выбрать
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Playing Indicator */}
                {activeStation === i && (
                  <motion.div 
                    className="absolute top-4 right-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-primary rounded-full"
                          animate={{ height: [8, 16, 8] }}
                          transition={{ duration: 0.5, delay: bar * 0.1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Radio Section */}
      <section className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Почему<br />
                <span className="text-primary">радио?</span>
              </h2>
              <p className="text-lg opacity-80 mb-8">
                Радиореклама — это прямой разговор с вашим клиентом. 
                Без отвлечений, без прокрутки, без блокировщиков.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Zap, title: "Мгновенный охват", desc: "Ваше сообщение услышат тысячи людей за секунды" },
                  { icon: Users, title: "Точная аудитория", desc: "Каждая станция — свой портрет слушателя" },
                  { icon: Volume2, title: "Эмоциональный контакт", desc: "Голос создаёт доверие лучше любого баннера" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm opacity-60">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "87%", label: "слушают радио в авто" },
                  { value: "3.5ч", label: "среднее время в эфире" },
                  { value: "12×", label: "запоминаемость выше баннеров" },
                  { value: "65%", label: "совершают покупки после рекламы" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border border-background/10"
                  >
                    <p className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.value}</p>
                    <p className="text-sm opacity-60">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Готовы быть<br />
              <span className="text-primary">услышанными?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Оставьте заявку, и мы подберём идеальный пакет размещения для вашего бизнеса
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 h-14 gap-2">
                <Phone className="w-5 h-5" />
                Позвонить нам
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 gap-2" asChild>
                <a href="https://t.me/YaRadioBot" target="_blank" rel="noopener noreferrer">
                  <Send className="w-5 h-5" />
                  Написать в Telegram
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={logoRTO} alt="РТО" className="h-10 object-contain" />
              <div className="text-sm text-muted-foreground">
                <p>Радио Тюменской области</p>
                <p>Ялуторовск • Заводоуковск</p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <a href="tel:+73453550151" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                8 (34535) 5-01-51
              </a>
              <a href="mailto:yaradio@bk.ru" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                yaradio@bk.ru
              </a>
              <a href="https://t.me/YaRadioBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Send className="w-4 h-4" />
                Telegram
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {radioStations.map((station) => (
                <img 
                  key={station.name}
                  src={station.logo} 
                  alt={station.name} 
                  className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">© 2024 РТО. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreativeIndex;
