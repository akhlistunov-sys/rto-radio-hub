import { useState, useMemo } from "react";
import { 
  Sparkles, Send, Loader2, Target, Clock, Download, 
  Table as TableIcon, ScrollText, Mic2, Radio as RadioIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  STATIONS, SLOTS_LABELS, calculateMediaPlan, 
  AIMediaPlan 
} from "@/lib/mediaplan";
import { exportToExcel } from "@/lib/exportExcel";

const MediaPlanner = () => {
  const [aiInput, setAiInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mediaPlan, setMediaPlan] = useState<AIMediaPlan | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [formSent, setFormSent] = useState(false);

  const stats = useMemo(() => {
    if (!mediaPlan) return null;
    
    const recNames = (mediaPlan.recommendedStations || []).map(s => s.name.toUpperCase());
    const selectedIds = STATIONS.filter(s => 
      recNames.some(n => n.includes(s.name.toUpperCase()))
    ).map(s => s.id);
    const finalIds = selectedIds.length > 0 ? selectedIds : STATIONS.map(s => s.id);
    
    const simulatedSlots = mediaPlan.recommendedSlotIndices?.length > 0
      ? mediaPlan.recommendedSlotIndices 
      : Array.from({ length: mediaPlan.recommendedExitsPerDay || 15 }, (_, i) => i);
    
    return calculateMediaPlan(finalIds, 30, 20, simulatedSlots);
  }, [mediaPlan]);

  const generateMediaPlan = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);
    setMediaPlan(null);
    setFormSent(false);
    
    // Simulate AI response for demo (replace with actual Gemini API call when API key is available)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Demo response based on input
    const demoResponse: AIMediaPlan = {
      strategy: `Для вашего бизнеса "${aiInput.slice(0, 50)}..." рекомендуем комплексное размещение на 3-4 радиостанциях с акцентом на утренний и вечерний прайм-тайм для максимального охвата.`,
      recommendedExitsPerDay: 10,
      recommendedSlotIndices: [0, 1, 2, 7, 8, 9, 10, 11, 12, 13],
      targetAudience: "Мужчины и женщины 25-55 лет, средний и выше среднего доход, активные потребители товаров и услуг в регионе Ялуторовска и Заводоуковска.",
      recommendedStations: [
        { name: "Ретро FM", reason: "Высокая лояльность аудитории 30-55 лет, отличный отклик на рекламу" },
        { name: "Авторадио", reason: "Охват автомобилистов с доходом, активные покупатели" },
        { name: "Радио Дача", reason: "Семейная аудитория, высокое доверие к рекламе" },
      ],
      creativeTip: "Используйте локальные особенности и упоминайте конкретные адреса или ориентиры города для повышения узнаваемости.",
      scripts: [
        { 
          version: "Информационный", 
          text: "Внимание! Специальное предложение для жителей Ялуторовска! [Ваше предложение]. Адрес: [адрес]. Телефон: [номер]. Ждём вас!", 
          duration: "15-20 сек" 
        },
        { 
          version: "Эмоциональный", 
          text: "Мечтаете о [желание клиента]? Теперь это возможно! [Ваше предложение]. Приходите по адресу: [адрес]. Мы рады каждому клиенту!", 
          duration: "15-20 сек" 
        },
        { 
          version: "С призывом к действию", 
          text: "Только сейчас! [Ваше предложение]. Успейте воспользоваться! Звоните: [номер] или приходите: [адрес]. Количество ограничено!", 
          duration: "15-20 сек" 
        },
      ]
    };
    
    setMediaPlan(demoResponse);
    setIsGenerating(false);
  };

  const handleExport = () => {
    if (!stats || !mediaPlan) return;
    exportToExcel({
      stats,
      days: 30,
      duration: 20,
      slotIndices: mediaPlan.recommendedSlotIndices || Array.from({ length: 15 }, (_, i) => i),
      aiInput,
      mediaPlan
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const isInteractingAI = mediaPlan !== null || isGenerating;

  return (
    <section className="flex-1 flex flex-col items-center p-8 overflow-y-auto animate-fade-in">
      <div className={cn(
        "w-full max-w-2xl transition-all duration-1000",
        isInteractingAI ? "pt-4" : "pt-16"
      )}>
        {/* Hero Area */}
        <div className={cn(
          "text-center space-y-4 transition-all duration-1000",
          isInteractingAI ? "mb-6" : "mb-8"
        )}>
          <div className="inline-flex items-center gap-2 text-primary">
            <Sparkles className="w-6 h-6" />
            <h1 className={cn(
              "font-bold text-foreground transition-all duration-500",
              isInteractingAI ? "text-xl" : "text-3xl md:text-4xl"
            )}>
              Интеллектуальный медиапланер
            </h1>
          </div>
          {!isInteractingAI && (
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Опишите ваш бизнес или целевую аудиторию, и наш ИИ-помощник мгновенно предложит оптимальное решение для размещения рекламы.
            </p>
          )}
        </div>

        {/* Input Card */}
        <div className="glass-card p-6 space-y-4 mb-8">
          <Textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Например: У меня открывается новый магазин стройматериалов в Ялуторовске, кто мой слушатель?"
            className="min-h-[100px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
          
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>AI готов помочь</span>
            </div>
            <Button 
              onClick={generateMediaPlan}
              disabled={isGenerating || !aiInput.trim()}
              className="gradient-primary gap-2 rounded-full px-6"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Получить совет
            </Button>
          </div>
        </div>

        {/* Quick Suggestions */}
        {!isInteractingAI && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              "Автосервис",
              "Кафе и рестораны",
              "Строительство",
              "Медицина",
              "Образование"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setAiInput(`У меня бизнес в сфере "${suggestion}". Какие радиостанции подойдут?`)}
                className="px-4 py-2 text-sm rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {isGenerating && (
        <div className="w-full flex flex-col items-center gap-4 py-12 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          </div>
          <p className="text-primary font-semibold text-xs uppercase tracking-widest animate-pulse">
            Искусственный интеллект анализирует аудиторию...
          </p>
        </div>
      )}

      {/* AI Results */}
      {stats && mediaPlan && !isGenerating && (
        <div className="w-full max-w-5xl space-y-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Media Grid Table */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-primary" />
                    Медиа-сетка (AI рекомендация)
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
                          <td className="py-4 text-center font-semibold text-muted-foreground">30</td>
                          <td className="py-4 text-center font-semibold text-muted-foreground">
                            {mediaPlan.recommendedSlotIndices?.length || mediaPlan.recommendedExitsPerDay || 15}
                          </td>
                          <td className="py-4 text-right font-bold text-primary">~{s.calculatedReach.toLocaleString()}</td>
                          <td className="py-4 text-right font-bold text-foreground">~{(s.calculatedReach * 30).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Recommended Slots */}
                {mediaPlan.recommendedSlotIndices && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Рекомендованные временные слоты:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {mediaPlan.recommendedSlotIndices.map((idx) => (
                        <div key={idx} className="bg-secondary px-3 py-1.5 rounded-lg text-[10px] font-semibold text-foreground">
                          {SLOTS_LABELS[idx]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy Block */}
              <div className="glass-card p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Стратегия и ЦА</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {mediaPlan.targetAudience}
                  </p>
                  <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-primary text-sm font-medium leading-relaxed italic">
                      "{mediaPlan.strategy}"
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary/60" />
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Рекомендуемая частота: {mediaPlan.recommendedExitsPerDay} выходов в сутки
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Recommended Stations */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <RadioIcon className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Медиа сплит (рекомендации)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mediaPlan.recommendedStations?.map((rs, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="font-bold text-foreground text-xs mb-1 uppercase">{rs.name}</div>
                        <p className="text-muted-foreground text-xs leading-relaxed">{rs.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-4 space-y-6">
              {/* Price Summary */}
              <div className="glass-card p-6 bg-primary text-primary-foreground border-primary">
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
                      {formSent ? '✓ Отправлено!' : 'Отправить заявку'}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Creative Tip */}
              <div className="glass-card p-6 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 mb-3">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest">Креативный совет</h3>
                </div>
                <p className="text-amber-900 font-medium italic text-sm leading-relaxed">
                  «{mediaPlan.creativeTip}»
                </p>
              </div>
            </div>
          </div>

          {/* Script Versions */}
          {mediaPlan.scripts && (
            <div className="glass-card p-8">
              <div className="flex items-center gap-2 mb-8">
                <ScrollText className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
                  Примеры текстов роликов (до 20 сек)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mediaPlan.scripts.map((script, idx) => (
                  <div key={idx} className="flex flex-col h-full bg-secondary/50 rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Вариант {idx + 1}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {script.duration}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                      <Mic2 className="w-6 h-6 text-muted-foreground/30 mb-3" />
                      <p className="text-foreground font-medium text-center leading-relaxed text-sm italic">
                        {script.text}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                        {script.version}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MediaPlanner;
