import { useState } from "react";
import { Radio, Calendar, Clock, Users, TrendingUp, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Import logos
import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

interface Station {
  id: string;
  name: string;
  frequency: string;
  city: string;
  color: string;
  dailyReach: number;
  selected: boolean;
  logo: string;
}

const initialStations: Station[] = [
  { id: "retro-fm", name: "Ретро FM", frequency: "89.0 МГц", city: "Ялуторовск", color: "bg-retro-fm", dailyReach: 2596, selected: true, logo: logoRetro },
  { id: "radio-dacha", name: "Радио Дача", frequency: "105.9 МГц", city: "Ялуторовск", color: "bg-radio-dacha", dailyReach: 2343, selected: true, logo: logoDacha },
  { id: "humor-fm", name: "Юмор FM", frequency: "93.9 МГц", city: "Ялуторовск", color: "bg-humor-fm", dailyReach: 1514, selected: false, logo: logoHumor },
  { id: "love-radio", name: "Love Radio", frequency: "88.1 / 92.2 МГц", city: "Ялуторовск, Заводоуковск", color: "bg-love-radio", dailyReach: 1009, selected: false, logo: logoLove },
  { id: "shanson", name: "Радио Шансон", frequency: "101.0 МГц", city: "Заводоуковск", color: "bg-shanson", dailyReach: 2081, selected: false, logo: logoShanson },
  { id: "avtoradio", name: "Авторадио", frequency: "105.3 МГц", city: "Заводоуковск", color: "bg-avtoradio", dailyReach: 2343, selected: true, logo: logoAutoradio },
];

const timeSlots = [
  { label: "07:00", time: "07:00-08:00", multiplier: 1.2, icon: "🌅" },
  { label: "08:00", time: "08:00-09:00", multiplier: 1.3, icon: "🌅" },
  { label: "09:00", time: "09:00-10:00", multiplier: 1.2, icon: "🌅" },
  { label: "10:00", time: "10:00-11:00", multiplier: 1.0, icon: "☀️" },
  { label: "11:00", time: "11:00-12:00", multiplier: 1.0, icon: "☀️" },
  { label: "12:00", time: "12:00-13:00", multiplier: 1.1, icon: "☀️" },
  { label: "13:00", time: "13:00-14:00", multiplier: 1.0, icon: "☀️" },
  { label: "14:00", time: "14:00-15:00", multiplier: 1.0, icon: "☀️" },
  { label: "15:00", time: "15:00-16:00", multiplier: 1.0, icon: "☀️" },
  { label: "16:00", time: "16:00-17:00", multiplier: 1.2, icon: "🌆" },
  { label: "17:00", time: "17:00-18:00", multiplier: 1.3, icon: "🌆" },
  { label: "18:00", time: "18:00-19:00", multiplier: 1.3, icon: "🌆" },
  { label: "19:00", time: "19:00-20:00", multiplier: 1.2, icon: "🌆" },
  { label: "20:00", time: "20:00-21:00", multiplier: 0.9, icon: "🌙" },
  { label: "21:00", time: "21:00-22:00", multiplier: 0.8, icon: "🌙" },
  { label: "22:00", time: "22:00-23:00", multiplier: 0.7, icon: "🌙" },
];

const Calculator = () => {
  const [days, setDays] = useState(30);
  const [duration, setDuration] = useState(20);
  const [stations, setStations] = useState(initialStations);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(["Утро", "День", "Вечер"]);

  const selectedStations = stations.filter(s => s.selected);
  const totalReach = selectedStations.reduce((sum, s) => sum + s.dailyReach * days, 0);
  const exitsPerDay = 15;
  const pricePerContact = 0.16;
  const totalPrice = Math.round(totalReach * pricePerContact);

  const toggleStation = (id: string) => {
    setStations(stations.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const toggleSlot = (label: string) => {
    setSelectedSlots(prev => 
      prev.includes(label) 
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Калькулятор рекламы
          </div>
          <h1 className="text-2xl font-bold text-foreground">Рассчитайте стоимость кампании</h1>
          <p className="text-muted-foreground">Настройте параметры и получите мгновенный расчёт</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Side - Configuration */}
          <div className="lg:col-span-3 space-y-4">
            {/* Stations Grid - moved to top */}
            <div className="glass-card p-5">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2 text-sm">
                <Radio className="w-4 h-4 text-primary" />
                Радиостанции
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {stations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => toggleStation(station.id)}
                    className={cn(
                      "relative p-3 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden",
                      station.selected
                        ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5"
                        : "border-border hover:border-primary/40 bg-card"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={station.logo} 
                        alt={station.name}
                        className="w-10 h-10 object-contain rounded-lg bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-foreground block text-sm">{station.name}</span>
                        <div className="text-xs text-muted-foreground">{station.frequency}</div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{station.city}</span>
                          <div className="flex items-center gap-1 text-[10px]">
                            <Users className="w-2.5 h-2.5 text-primary" />
                            <span className="text-primary font-medium">{station.dailyReach.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {station.selected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Card - smaller */}
            <div className="glass-card p-4 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">Срок размещения</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{days} дней</span>
                </div>
                <Slider
                  value={[days]}
                  onValueChange={(value) => setDays(value[0])}
                  min={7}
                  max={90}
                  step={1}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>7 дней</span>
                  <span>90 дней</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">Хронометраж ролика</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{duration} сек</span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={10}
                  max={60}
                  step={5}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>10 сек</span>
                  <span>60 сек</span>
                </div>
              </div>
            </div>

            {/* Time Slots - compact 16 slots */}
            <div className="glass-card p-4">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                Время эфира (выберите слоты)
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.label}
                    onClick={() => toggleSlot(slot.label)}
                    className={cn(
                      "relative p-2 rounded-lg border transition-all duration-300 text-center group",
                      selectedSlots.includes(slot.label)
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/40 bg-card"
                    )}
                  >
                    <div className="text-xs mb-0.5">{slot.icon}</div>
                    <div className="text-xs font-medium text-foreground">{slot.label}</div>
                    {selectedSlots.includes(slot.label) && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Выбрано: {selectedSlots.length} из {timeSlots.length} слотов
              </p>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-6 space-y-6 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
              {/* Price Badge */}
              <div className="text-center pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Стоимость кампании</p>
                <div className="relative inline-block">
                  <span className="text-5xl font-bold text-primary">
                    {totalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-bold text-primary ml-1">₽</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{totalReach.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">охват</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{pricePerContact}</p>
                  <p className="text-xs text-muted-foreground">₽ / контакт</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <Radio className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{selectedStations.length}</p>
                  <p className="text-xs text-muted-foreground">станций</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{exitsPerDay * days}</p>
                  <p className="text-xs text-muted-foreground">выходов</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground text-center">Оставить заявку</h4>
                <Input 
                  placeholder="Ваше имя" 
                  className="bg-background/80 border-border"
                />
                <Input 
                  placeholder="Телефон" 
                  className="bg-background/80 border-border"
                />
                <Button className="w-full gap-2 h-12 text-base">
                  <Send className="w-4 h-4" />
                  Получить предложение
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  🎁 +1 день размещения в подарок
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
