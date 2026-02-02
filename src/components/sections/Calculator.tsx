import { useState } from "react";
import { Radio, Calendar, Clock, Users, TrendingUp, Send, Sparkles, CheckSquare, Square } from "lucide-react";
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

interface TimeSlot {
  id: string;
  time: string;
  label: string;
  description: string;
  coverage: number;
  selected: boolean;
}

const initialStations: Station[] = [
  { id: "retro-fm", name: "Ретро FM", frequency: "89.0 МГц", city: "Ялуторовск", color: "bg-retro-fm", dailyReach: 3600, selected: true, logo: logoRetro },
  { id: "radio-dacha", name: "Радио Дача", frequency: "105.9 МГц", city: "Ялуторовск", color: "bg-radio-dacha", dailyReach: 3250, selected: true, logo: logoDacha },
  { id: "humor-fm", name: "Юмор FM", frequency: "93.9 МГц", city: "Ялуторовск", color: "bg-humor-fm", dailyReach: 2100, selected: false, logo: logoHumor },
  { id: "love-radio", name: "Love Radio", frequency: "88.1 / 92.2 МГц", city: "Ялуторовск, Заводоуковск", color: "bg-love-radio", dailyReach: 700, selected: false, logo: logoLove },
  { id: "shanson", name: "Радио Шансон", frequency: "101.0 МГц", city: "Заводоуковск", color: "bg-shanson", dailyReach: 2900, selected: false, logo: logoShanson },
  { id: "avtoradio", name: "Авторадио", frequency: "105.3 МГц", city: "Заводоуковск", color: "bg-avtoradio", dailyReach: 3250, selected: true, logo: logoAutoradio },
];

const initialTimeSlots: TimeSlot[] = [
  { id: "06", time: "06:00-07:00", label: "06:00", description: "Подъем, сборы", coverage: 6, selected: false },
  { id: "07", time: "07:00-08:00", label: "07:00", description: "Утренние поездки", coverage: 10, selected: true },
  { id: "08", time: "08:00-09:00", label: "08:00", description: "Пик трафика", coverage: 12, selected: true },
  { id: "09", time: "09:00-10:00", label: "09:00", description: "Начало работы", coverage: 8, selected: true },
  { id: "10", time: "10:00-11:00", label: "10:00", description: "Рабочий процесс", coverage: 7, selected: false },
  { id: "11", time: "11:00-12:00", label: "11:00", description: "Предобеденное время", coverage: 6, selected: false },
  { id: "12", time: "12:00-13:00", label: "12:00", description: "Обеденный перерыв", coverage: 5, selected: false },
  { id: "13", time: "13:00-14:00", label: "13:00", description: "После обеда", coverage: 5, selected: false },
  { id: "14", time: "14:00-15:00", label: "14:00", description: "Вторая половина дня", coverage: 5, selected: false },
  { id: "15", time: "15:00-16:00", label: "15:00", description: "Рабочий финиш", coverage: 6, selected: false },
  { id: "16", time: "16:00-17:00", label: "16:00", description: "Конец рабочего дня", coverage: 7, selected: false },
  { id: "17", time: "17:00-18:00", label: "17:00", description: "Вечерние поездки", coverage: 10, selected: true },
  { id: "18", time: "18:00-19:00", label: "18:00", description: "Пик трафика", coverage: 8, selected: true },
  { id: "19", time: "19:00-20:00", label: "19:00", description: "Домашний вечер", coverage: 4, selected: false },
  { id: "20", time: "20:00-21:00", label: "20:00", description: "Вечерний отдых", coverage: 4, selected: false },
];

const Calculator = () => {
  const [days, setDays] = useState(30);
  const [duration, setDuration] = useState(20);
  const [stations, setStations] = useState(initialStations);
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);

  const selectedStations = stations.filter(s => s.selected);
  const selectedSlots = timeSlots.filter(s => s.selected);
  const stationsCount = selectedStations.length;
  const slotsCount = selectedSlots.length;

  // Расчет по формулам из JSON
  // 1. spots_per_day = stations_count × slots_count
  const spotsPerDay = stationsCount * slotsCount;
  
  // 2. total_spots = spots_per_day × campaign_days
  const totalSpots = spotsPerDay * days;
  
  // 3. applied_price_per_sec по тарифам
  let pricePerSec = 1.5;
  if (stationsCount >= 6) pricePerSec = 1.1;
  else if (stationsCount >= 5) pricePerSec = 1.2;
  else if (stationsCount >= 3) pricePerSec = 1.3;
  
  // 4. cost_per_spot = duration × applied_price
  const costPerSpot = duration * pricePerSec;
  
  // 5. base_air_cost = cost_per_spot × total_spots
  const baseAirCost = costPerSpot * totalSpots;
  
  // 6. Если все 15 слотов: скидка 5%
  const isMaxCoverage = slotsCount >= 15;
  const bonusDiscount = isMaxCoverage ? 0.05 : 0;
  
  // 7. final_price = base_air_cost × (1 - bonus_discount) - production_cost = 0 (в подарок)
  const finalPrice = Math.round(baseAirCost * (1 - bonusDiscount));
  
  // 8. Охват = sum(station_listeners) × sum(slot_coverage%) × 0.7
  const totalListeners = selectedStations.reduce((sum, s) => sum + s.dailyReach, 0);
  const totalCoveragePercent = selectedSlots.reduce((sum, s) => sum + s.coverage, 0) / 100;
  const totalReach = Math.round(totalListeners * totalCoveragePercent * 0.7 * days);
  
  // 9. cost_per_contact = final_price / total_contacts
  const costPerContact = totalReach > 0 ? finalPrice / totalReach : 0;

  const toggleStation = (id: string) => {
    setStations(stations.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const toggleAllStations = () => {
    const allSelected = stations.every(s => s.selected);
    setStations(stations.map(s => ({ ...s, selected: !allSelected })));
  };

  const toggleSlot = (id: string) => {
    setTimeSlots(timeSlots.map(s => 
      s.id === id ? { ...s, selected: !s.selected } : s
    ));
  };

  const toggleAllSlots = () => {
    const allSelected = timeSlots.every(s => s.selected);
    setTimeSlots(timeSlots.map(s => ({ ...s, selected: !allSelected })));
  };

  const allStationsSelected = stations.every(s => s.selected);
  const allSlotsSelected = timeSlots.every(s => s.selected);

  return (
    <section className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Калькулятор рекламы
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Рассчитайте стоимость кампании</h1>
          <p className="text-sm text-muted-foreground">🎁 Ролик в подарок! Настройте параметры и получите мгновенный расчёт</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
          {/* Left Side - Configuration */}
          <div className="lg:col-span-3 space-y-4">
            {/* Stations Grid */}
            <div className="glass-card p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground flex items-center gap-2 text-sm">
                  <Radio className="w-4 h-4 text-primary" />
                  Радиостанции
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAllStations}
                  className="text-xs gap-1.5"
                >
                  {allStationsSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  {allStationsSelected ? "Снять все" : "Выбрать все"}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                        className="w-10 h-10 object-contain rounded-lg bg-white flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-foreground block text-sm truncate">{station.name}</span>
                        <div className="text-xs text-muted-foreground">{station.frequency}</div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-muted-foreground truncate">{station.city}</span>
                          <div className="flex items-center gap-1 text-[10px]">
                            <Users className="w-2.5 h-2.5 text-primary" />
                            <span className="text-primary font-medium">{station.dailyReach.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

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
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Выбрано: {stationsCount} из 6 • Тариф: {pricePerSec} ₽/сек
              </p>
            </div>

            {/* Sliders Card */}
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
                  min={7}
                  max={30}
                  step={1}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>7 сек</span>
                  <span>30 сек</span>
                </div>
              </div>
            </div>

            {/* Time Slots - 15 slots with coverage */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  Время эфира
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAllSlots}
                  className="text-xs gap-1.5"
                >
                  {allSlotsSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  {allSlotsSelected ? "Снять все" : "Выбрать все"}
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => toggleSlot(slot.id)}
                    className={cn(
                      "relative p-2 rounded-lg border transition-all duration-300 text-center group",
                      slot.selected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/40 bg-card"
                    )}
                  >
                    <div className="text-xs font-medium text-foreground">{slot.time.split('-')[0]}</div>
                    <div className="text-[9px] text-muted-foreground truncate" title={slot.description}>{slot.description}</div>
                    <div className="text-[10px] text-primary font-medium mt-0.5">👥 {slot.coverage}%</div>
                    {slot.selected && (
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-1 mt-2">
                <p className="text-[10px] text-muted-foreground">
                  Выбрано: {slotsCount} из 15 слотов
                </p>
                {isMaxCoverage && (
                  <p className="text-[10px] text-green-600 font-medium">
                    🎉 Скидка 5% за максимальный охват!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4 md:p-6 sticky top-4 space-y-4 md:space-y-6 border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
              {/* Price Badge */}
              <div className="text-center pb-4 md:pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Стоимость кампании</p>
                <div className="relative inline-block">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {finalPrice.toLocaleString()}
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-primary ml-1">₽</span>
                </div>
                {isMaxCoverage && (
                  <p className="text-xs text-green-600 mt-1">Включая скидку 5%</p>
                )}
                <p className="text-xs text-green-600 mt-1">🎁 Ролик бесплатно</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-xl bg-secondary/50 text-center">
                  <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-primary mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-bold text-foreground">{totalReach.toLocaleString()}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">охват</p>
                </div>
                <div className="p-3 md:p-4 rounded-xl bg-secondary/50 text-center">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-primary mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-bold text-foreground">{costPerContact.toFixed(2)}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">₽ / контакт</p>
                </div>
                <div className="p-3 md:p-4 rounded-xl bg-secondary/50 text-center">
                  <Radio className="w-4 md:w-5 h-4 md:h-5 text-primary mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-bold text-foreground">{stationsCount}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">станций</p>
                </div>
                <div className="p-3 md:p-4 rounded-xl bg-secondary/50 text-center">
                  <Calendar className="w-4 md:w-5 h-4 md:h-5 text-primary mx-auto mb-1 md:mb-2" />
                  <p className="text-lg md:text-2xl font-bold text-foreground">{totalSpots}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">выходов</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground text-center text-sm">Оставить заявку</h4>
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
                  🎁 Ролик в подарок при заказе!
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
