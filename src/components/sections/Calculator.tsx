import { useState } from "react";
import { Settings2, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Station {
  id: string;
  name: string;
  frequency: string;
  city: string;
  color: string;
  dailyReach: number;
  selected: boolean;
}

const initialStations: Station[] = [
  { id: "retro-fm", name: "Ретро FM", frequency: "89.0 МГц", city: "Ялуторовск", color: "bg-retro-fm", dailyReach: 2596, selected: true },
  { id: "radio-dacha", name: "Радио Дача", frequency: "105.9 МГц", city: "Ялуторовск", color: "bg-radio-dacha", dailyReach: 2343, selected: true },
  { id: "humor-fm", name: "Юмор FM", frequency: "93.9 МГц", city: "Ялуторовск", color: "bg-humor-fm", dailyReach: 1514, selected: false },
  { id: "love-radio", name: "Love Radio", frequency: "88.1 / 92.2 МГц", city: "Ялуторовск, Заводоуковск", color: "bg-love-radio", dailyReach: 1009, selected: false },
  { id: "shanson", name: "Радио Шансон", frequency: "101.0 МГц", city: "Заводоуковск", color: "bg-shanson", dailyReach: 2081, selected: false },
  { id: "avtoradio", name: "Авторадио", frequency: "105.3 МГц", city: "Заводоуковск", color: "bg-avtoradio", dailyReach: 2343, selected: true },
];

const timeSlots = [
  "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
  "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00",
];

const Calculator = () => {
  const [days, setDays] = useState(30);
  const [duration, setDuration] = useState(20);
  const [stations, setStations] = useState(initialStations);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(timeSlots);

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

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) 
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left Column - Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parameters Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">ПАРАМЕТРЫ РАЗМЕЩЕНИЯ</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Дней проката</Label>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="bg-secondary/50 border-0 text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Хронометраж (сек)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-secondary/50 border-0 text-lg font-medium"
                />
              </div>
            </div>
          </div>

          {/* Stations Selection */}
          <div className="glass-card p-6">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Выбор станций (РТО)</h3>
            <div className="space-y-2">
              {stations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => toggleStation(station.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    station.selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    station.selected ? "bg-primary" : "bg-secondary"
                  )}>
                    {station.selected && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${station.color}`} />
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{station.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">{station.frequency}</span>
                    <span className="text-sm text-muted-foreground"> • {station.city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="glass-card p-6">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Индивидуальные слоты</h3>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedSlots.includes(slot)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <span className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="bg-muted-foreground/50 rounded-sm" />
                  ))}
                </span>
                МЕДИА-СЕТКА
              </h3>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                <Download className="w-4 h-4" />
                EXCEL
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">СТАНЦИЯ</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">ДНЕЙ</th>
                    <th className="text-center py-3 px-2 text-muted-foreground font-medium">ВЫХОДОВ</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">ОХВАТ В СУТКИ</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">ИТОГО ОХВАТ</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStations.map((station) => (
                    <tr key={station.id} className="border-b border-border/50">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${station.color}`} />
                          <div>
                            <div className="font-medium text-foreground">{station.name}</div>
                            <div className="text-xs text-muted-foreground">{station.frequency}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2 text-foreground">{days}</td>
                      <td className="text-center py-4 px-2 text-foreground">{exitsPerDay}</td>
                      <td className="text-right py-4 px-2 text-primary font-medium">~{station.dailyReach.toLocaleString()}</td>
                      <td className="text-right py-4 px-2 text-foreground font-medium">~{(station.dailyReach * days).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-6 border-2 border-primary/20">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              ИТОГ РАСЧЁТА
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">К ОПЛАТЕ</p>
                <p className="text-4xl font-bold text-primary">
                  {totalPrice.toLocaleString()} ₽
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Суммарный охват</p>
                  <p className="text-xl font-bold text-foreground">{totalReach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Цена контакта</p>
                  <p className="text-xl font-bold text-foreground">{pricePerContact} ₽</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Заказать кампанию</h4>
                <Input placeholder="Ваше имя" className="bg-secondary/50 border-0" />
                <Input placeholder="Телефон" className="bg-secondary/50 border-0" />
                <Button className="w-full" variant="outline">
                  ОТПРАВИТЬ ЗАЯВКУ И ПОЛУЧИТЬ РАДИО В ПОДАРОК
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
