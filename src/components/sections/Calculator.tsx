import { useState, useMemo } from "react";
import { 
  Radio, Calendar, Clock, Users, TrendingUp, Send, Sparkles, 
  Download, Settings2, Star, Table as TableIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { STATIONS, SLOTS_LABELS, calculateMediaPlan } from "@/lib/mediaplan";
import { exportToExcel } from "@/lib/exportExcel";

const Calculator = () => {
  const [days, setDays] = useState(30);
  const [duration, setDuration] = useState(20);
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>(STATIONS.map(s => s.id));
  const [selectedSlots, setSelectedSlots] = useState<number[]>(Array.from({ length: 15 }, (_, i) => i));
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [formSent, setFormSent] = useState(false);

  const stats = useMemo(() => {
    return calculateMediaPlan(selectedStationIds, days, duration, selectedSlots);
  }, [selectedStationIds, days, duration, selectedSlots]);

  const toggleStation = (id: string) => {
    setSelectedStationIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleSlot = (index: number) => {
    setSelectedSlots(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleExport = () => {
    exportToExcel({
      stats,
      days,
      duration,
      slotIndices: selectedSlots,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Индивидуальный калькулятор
          </div>
          <h1 className="text-2xl font-bold text-foreground">Точный расчет стоимости размещения</h1>
          <p className="text-muted-foreground">Настройте параметры по вашим требованиям</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Side - Configuration */}
          <div className="lg:col-span-7 space-y-6">
            {/* Parameters Card */}
            <div className="glass-card p-6 space-y-8">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Параметры размещения
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Дней проката</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{days}</span>
                  </div>
                  <Slider
                    value={[days]}
                    onValueChange={(value) => setDays(value[0])}
                    min={1}
                    max={365}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Хронометраж</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{duration} сек</span>
                  </div>
                  <Slider
                    value={[duration]}
                    onValueChange={(value) => setDuration(value[0])}
                    min={5}
                    max={60}
                    step={5}
                    className="py-2"
                  />
                </div>
              </div>
            </div>

            {/* Stations Selection */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Radio className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Выбор станций (РТО)
                </span>
              </div>
              <div className="space-y-3">
                {STATIONS.map(station => {
                  const isSelected = selectedStationIds.includes(station.id);
                  return (
                    <button
                      key={station.id}
                      onClick={() => toggleStation(station.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border bg-card hover:border-primary/40"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      )}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      {station.id === 'avto' && (
                        <Star className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" />
                      )}
                      <img 
                        src={station.logo} 
                        alt={station.name}
                        className="w-10 h-10 object-contain rounded-lg bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground">{station.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {station.freq} • {station.cities.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">~{station.listeners.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">слушателей</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Индивидуальные слоты
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SLOTS_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => toggleSlot(i)}
                    className={cn(
                      "py-3 px-2 rounded-xl font-semibold text-xs transition-all",
                      selectedSlots.includes(i)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price Card */}
            <div className="glass-card p-6 bg-primary text-primary-foreground border-primary sticky top-6">
              <div className="flex justify-between items-start mb-8">
                <Sparkles className="w-6 h-6 opacity-50" />
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Итог расчета
                </span>
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="opacity-60 text-[10px] font-bold uppercase tracking-widest mb-2">К оплате</p>
                  <div className="text-4xl font-bold tracking-tight">{stats.finalPrice.toLocaleString()} ₽</div>
                </div>
                
                <div className="h-px bg-white/20" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="opacity-60 text-[10px] font-bold uppercase tracking-widest mb-1">Суммарный охват</p>
                    <div className="text-xl font-bold">{stats.totalContacts.toLocaleString()}</div>
                  </div>
                  <div>
                    <p className="opacity-60 text-[10px] font-bold uppercase tracking-widest mb-1">Цена контакта</p>
                    <div className="text-xl font-bold">{stats.costPerContact} ₽</div>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3">Заказать кампанию</h4>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <Input 
                    required 
                    type="text" 
                    placeholder="Ваше имя" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/40"
                  />
                  <Input 
                    required 
                    type="tel" 
                    placeholder="Телефон" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white/10 border-white/10 text-white placeholder:text-white/40"
                  />
                  <Button 
                    type="submit" 
                    disabled={formSent}
                    className={cn(
                      "w-full font-bold text-xs uppercase tracking-widest",
                      formSent 
                        ? "bg-green-500 hover:bg-green-500" 
                        : "bg-white text-primary hover:bg-white/90"
                    )}
                  >
                    {formSent ? '✓ Отправлено!' : 'Отправить заявку и получить радио в подарок'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid Table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-primary" />
              Медиа-сетка
            </h3>
            <button 
              onClick={handleExport} 
              className="text-primary hover:text-primary/80 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-muted-foreground uppercase tracking-widest border-b border-border">
                  <th className="pb-4 font-bold">Станция</th>
                  <th className="pb-4 font-bold text-center">Дней</th>
                  <th className="pb-4 font-bold text-center">Выходов</th>
                  <th className="pb-4 font-bold text-right">Охват/сутки</th>
                  <th className="pb-4 font-bold text-right">Итого охват</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.stationDetails.map((s, i) => (
                  <tr key={i} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.logo} alt={s.name} className="w-8 h-8 object-contain rounded-lg bg-white" />
                        <div>
                          <div className="font-semibold text-foreground">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground">{s.freq}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center font-semibold text-muted-foreground">{days}</td>
                    <td className="py-4 text-center font-semibold text-muted-foreground">{selectedSlots.length}</td>
                    <td className="py-4 text-right font-bold text-primary">~{s.calculatedReach.toLocaleString()}</td>
                    <td className="py-4 text-right font-bold text-foreground">~{(s.calculatedReach * days).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
