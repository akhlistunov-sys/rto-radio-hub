import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Send, Menu, X, Radio, Calculator as CalcIcon, BarChart3, Info } from "lucide-react";
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

import ModernHeroSection from "@/components/ModernHeroSection";
import GlowingCard from "@/components/GlowingCard";
import SoundWaveVisualizer from "@/components/SoundWaveVisualizer";
import Calculator from "@/components/sections/Calculator";
import Statistics from "@/components/sections/Statistics";
import About from "@/components/sections/About";
import MediaPlanner from "@/components/sections/MediaPlanner";

const radioStations = [
  { name: "Ретро FM", freq: "89.0", logo: logoRetro, color: "#C8208E" },
  { name: "Радио Дача", freq: "105.9", logo: logoDacha, color: "#3BA4D8" },
  { name: "Юмор FM", freq: "93.9", logo: logoHumor, color: "#FACC15" },
  { name: "Love Radio", freq: "88.1", logo: logoLove, color: "#E73335" },
  { name: "Шансон", freq: "101.0", logo: logoShanson, color: "#1E3A8A" },
  { name: "Авторадио", freq: "105.3", logo: logoAutoradio, color: "#E73335" },
];

const navItems = [
  { id: "hero", label: "Главная", icon: Radio },
  { id: "planner", label: "Медиапланер", icon: Radio },
  { id: "calculator", label: "Калькулятор", icon: CalcIcon },
  { id: "statistics", label: "Статистика", icon: BarChart3 },
  { id: "about", label: "О нас", icon: Info },
];

const ModernIndex = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "hero":
        return <ModernHeroSection onNavigate={setActiveTab} />;
      case "planner":
        return <MediaPlanner />;
      case "calculator":
        return <Calculator />;
      case "statistics":
        return <Statistics />;
      case "about":
        return <About />;
      default:
        return <ModernHeroSection onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between backdrop-blur-xl border border-border/50">
            {/* Logo */}
            <motion.img 
              src={logoRTO} 
              alt="РТО" 
              className="h-10 object-contain cursor-pointer"
              onClick={() => setActiveTab("hero")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Contact Button */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+73453550151">
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden absolute left-4 right-4 top-20 glass-card rounded-2xl p-4 border border-border/50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Radio Station Bar - larger and more prominent */}
      {activeTab === "hero" && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="glass-card rounded-2xl px-8 py-5 flex items-center gap-6 border border-border/50 shadow-2xl">
            <span className="text-base font-medium text-foreground hidden sm:block">Наши станции:</span>
            <div className="flex items-center gap-4">
              {radioStations.map((station, i) => (
                <motion.div
                  key={station.name}
                  className="relative group"
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                >
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="w-14 h-14 rounded-xl bg-white p-1 object-contain cursor-pointer shadow-lg border border-white/50"
                  />
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="glass-card px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium shadow-lg">
                      {station.name} <span className="text-primary font-bold">{station.freq} FM</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img src={logoRTO} alt="РТО" className="h-10 object-contain" />
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="tel:+73453550151" className="hover:text-primary transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                8 (34535) 5-01-51
              </a>
              <a href="mailto:yaradio@bk.ru" className="hover:text-primary transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                yaradio@bk.ru
              </a>
              <a href="https://t.me/YaRadioBot" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Telegram
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              © 2024 РТО. Ялуторовск • Заводоуковск
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernIndex;
