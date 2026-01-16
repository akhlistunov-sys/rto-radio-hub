import { useState } from "react";
import { Phone, Mail, Send, ChevronRight, Radio, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Import logos
import retroFmLogo from "@/assets/logos/retro-fm.png";
import radioDachaLogo from "@/assets/logos/radio-dacha.jpg";
import humorFmLogo from "@/assets/logos/humor-fm.png";
import loveRadioLogo from "@/assets/logos/love-radio.png";
import shansonLogo from "@/assets/logos/shanson.jpg";
import avtoradioLogo from "@/assets/logos/avtoradio.jpg";
import rtoLogo from "@/assets/logos/rto.png";

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  audience: string;
  color: string;
  gradient: string;
  description: string;
  format: string;
  logo: string;
  reach: string;
}

const radioStations: RadioStation[] = [
  {
    id: "retro-fm",
    name: "Ретро FM",
    frequency: "89.0 МГц",
    audience: "30–55 лет",
    color: "from-pink-500 to-purple-600",
    gradient: "bg-gradient-to-br from-pink-500/20 to-purple-600/20",
    description: "Ностальгические хиты 70-90х, вызывающие сильный эмоциональный отклик.",
    format: "Ностальгия",
    logo: retroFmLogo,
    reach: "2 596",
  },
  {
    id: "radio-dacha",
    name: "Радио Дача",
    frequency: "105.9 МГц",
    audience: "35–65 лет",
    color: "from-sky-400 to-blue-500",
    gradient: "bg-gradient-to-br from-sky-400/20 to-blue-500/20",
    description: "Семейный формат для уюта и спокойствия.",
    format: "Семейный",
    logo: radioDachaLogo,
    reach: "2 343",
  },
  {
    id: "humor-fm",
    name: "Юмор FM",
    frequency: "93.9 МГц",
    audience: "25–45 лет",
    color: "from-yellow-400 to-amber-500",
    gradient: "bg-gradient-to-br from-yellow-400/20 to-amber-500/20",
    description: "Позитивный формат со смехом и легким настроением.",
    format: "Юмор",
    logo: humorFmLogo,
    reach: "1 514",
  },
  {
    id: "love-radio",
    name: "Love Radio",
    frequency: "88.1 / 92.2 МГц",
    audience: "18–35 лет",
    color: "from-red-500 to-rose-600",
    gradient: "bg-gradient-to-br from-red-500/20 to-rose-600/20",
    description: "Драйвовая и романтичная станция для молодежи.",
    format: "Молодёжный",
    logo: loveRadioLogo,
    reach: "1 009",
  },
  {
    id: "shanson",
    name: "Радио Шансон",
    frequency: "101.0 МГц",
    audience: "30–60 лет",
    color: "from-blue-600 to-indigo-700",
    gradient: "bg-gradient-to-br from-blue-600/20 to-indigo-700/20",
    description: "Станция с честными историями для мужчин.",
    format: "Шансон",
    logo: shansonLogo,
    reach: "2 081",
  },
  {
    id: "avtoradio",
    name: "Авторадио",
    frequency: "105.3 МГц",
    audience: "25–50 лет",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    description: "Музыка и новости для автомобилистов.",
    format: "Авто",
    logo: avtoradioLogo,
    reach: "2 343",
  },
];

const SidebarModern = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  return (
    <aside className="w-80 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 border-b border-white/10"
      >
        <img src={rtoLogo} alt="РТО" className="h-14 object-contain mb-3" />
        <p className="text-xs text-white/50 font-medium tracking-wider">ЯЛУТОРОВСК • ЗАВОДОУКОВСК</p>
      </motion.div>

      {/* Radio Stations */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto relative">
        {radioStations.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.button
              onClick={() => setSelectedStation(selectedStation === station.id ? null : station.id)}
              onHoverStart={() => setHoveredStation(station.id)}
              onHoverEnd={() => setHoveredStation(null)}
              className={cn(
                "w-full p-3 rounded-2xl transition-all duration-300 text-left relative overflow-hidden group",
                selectedStation === station.id ? station.gradient : "hover:bg-white/5"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover glow effect */}
              <AnimatePresence>
                {hoveredStation === station.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn("absolute inset-0 bg-gradient-to-r opacity-10", station.color)}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 relative">
                <motion.div 
                  className="relative"
                  animate={{ 
                    scale: selectedStation === station.id ? 1.1 : 1,
                  }}
                >
                  <img 
                    src={station.logo} 
                    alt={station.name} 
                    className="w-12 h-12 object-contain rounded-xl shadow-lg"
                  />
                  {/* Live indicator */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-white group-hover:text-primary transition-colors">
                    {station.name}
                  </h3>
                  <p className="text-xs text-white/50">{station.frequency}</p>
                </div>

                <motion.div
                  animate={{ rotate: selectedStation === station.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </motion.div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {selectedStation === station.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3">
                      <div className="flex gap-2">
                        <span className={cn("px-2 py-1 rounded-full text-[10px] font-medium text-white bg-gradient-to-r", station.color)}>
                          {station.format}
                        </span>
                        <span className="px-2 py-1 rounded-full text-[10px] font-medium text-white/70 bg-white/10">
                          {station.audience}
                        </span>
                      </div>
                      
                      <p className="text-xs text-white/60 leading-relaxed">
                        {station.description}
                      </p>

                      <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-white font-medium">{station.reach}</span>
                          <span className="text-[10px] text-white/40">в день</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-xs text-green-400">В эфире</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Contact Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative p-4 border-t border-white/10 space-y-3"
      >
        <a
          href="tel:+73453550151"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <span>8 (34535) 5-01-51</span>
        </a>
        <a
          href="mailto:yaradio@bk.ru"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <span>yaradio@bk.ru</span>
        </a>
        <a
          href="https://t.me/YaRadioBot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Send className="w-4 h-4" />
          </div>
          <span>Telegram Bot</span>
        </a>
      </motion.div>
    </aside>
  );
};

export default SidebarModern;
