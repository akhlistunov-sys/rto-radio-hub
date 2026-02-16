import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Radio, Lightbulb, FileText, Calculator, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MediaPlanResponse, MediaPlanJSON } from "@/lib/mediaplan-types";
import { generateMediaPlanJSON, exportToExcel } from "@/lib/export-utils";

const MediaPlanner = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<MediaPlanResponse | null>(null);
  const [mediaPlanJSON, setMediaPlanJSON] = useState<MediaPlanJSON | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);
    setMediaPlanJSON(null);

    try {
      const { data, error } = await supabase.functions.invoke("media-planner", {
        body: { query: query.trim() },
      });

      if (error) throw error;

      setAiResponse(data);
      const generatedJSON = generateMediaPlanJSON(data, query);
      setMediaPlanJSON(generatedJSON);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Ошибка соединения с AI помощником. Пожалуйста, позвоните нам напрямую.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async () => {
    if (!mediaPlanJSON || !aiResponse) return;
    const planId = exportToExcel(mediaPlanJSON);
    toast.success("Excel файл скачан!");
    
    // Send admin notification silently
    try {
      await supabase.functions.invoke("send-media-plan", {
        body: {
          type: "admin_notification",
          planId,
          mediaPlan: aiResponse,
          originalQuery: query,
        },
      });
    } catch (e) {
      console.error("Admin notification failed:", e);
    }
  };

  const dailyReach = aiResponse ? Math.round(aiResponse.calculation.estimated_reach / aiResponse.calculation.campaign_days) : 0;

  return (
    <section className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 animate-fade-in min-h-screen">
      <div className="max-w-4xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-primary">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Интеллектуальный медиапланер
            </h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Опишите ваш бизнес, и наш ИИ-помощник мгновенно составит медиаплан с расчётом стоимости
          </p>
        </div>

        {/* Enhanced Input Card - Gemini-style */}
        <div className="relative glass-card p-4 md:p-6 space-y-4 border-2 border-primary/20 hover:border-primary/40 transition-colors shadow-lg shadow-primary/5">
          <div className="absolute -top-3 left-4 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            ✨ AI помощник
          </div>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Опишите ваш бизнес, целевую аудиторию и задачи рекламной кампании..."
            className="min-h-[120px] resize-none border-0 bg-transparent text-sm md:text-base focus-visible:ring-0 placeholder:text-muted-foreground/60"
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>AI готов помочь</span>
            </div>
            <Button 
              className="gradient-primary gap-2 rounded-full px-6 hover:opacity-90 transition-opacity w-full sm:w-auto"
              disabled={!query.trim() || isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Анализирую...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Рекомендации ИИ
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Автосервис",
            "Кафе и рестораны",
            "Строительство",
            "Медицина",
            "Образование"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(`У меня бизнес в сфере "${suggestion}" в Ялуторовске. Какие радиостанции подойдут и сколько это будет стоить?`)}
              className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* AI Response */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Strategy */}
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Radio className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">📊 Стратегия: {aiResponse.strategy.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{aiResponse.strategy.description}</p>
              </div>

              {/* Recommended Stations */}
              <div className="glass-card p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-3">📻 Рекомендованные станции</h2>
                <div className="grid gap-2">
                  {aiResponse.recommendedStations.map((station, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="font-medium">{station.name} <span className="text-primary">{station.freq} FM</span></p>
                        <p className="text-xs text-muted-foreground">{station.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creative Tips */}
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                  </div>
                  <h2 className="text-lg font-semibold">💡 Креативные рекомендации</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Советы:</p>
                    <ul className="space-y-1">
                      {aiResponse.creative.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Креативные крючки:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.creative.hooks.map((hook, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {hook}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scripts */}
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <FileText className="w-5 h-5 text-green-500" />
                  </div>
                  <h2 className="text-lg font-semibold">🎙️ Варианты текстов роликов</h2>
                </div>
                <div className="space-y-3">
                  {aiResponse.scripts.map((script, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">Вариант {i + 1}: {script.title}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {script.duration} сек
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">"{script.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation */}
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Calculator className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-semibold">💰 Предварительный расчёт</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-primary">{aiResponse.calculation.stations_count}</p>
                    <p className="text-xs text-muted-foreground">станций</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-primary">{aiResponse.calculation.spots_per_day}</p>
                    <p className="text-xs text-muted-foreground">выходов/день</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-primary">~{dailyReach.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">охват/день</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-primary">{aiResponse.calculation.cost_per_contact.toFixed(2)}₽</p>
                    <p className="text-xs text-muted-foreground">за контакт</p>
                  </div>
                </div>

                {/* Detailed metrics */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Всего выходов</p>
                    <p className="font-bold text-foreground">{aiResponse.calculation.total_spots}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Контактов за период</p>
                    <p className="font-bold text-foreground">~{aiResponse.calculation.estimated_reach.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Период</p>
                    <p className="font-bold text-foreground">{aiResponse.calculation.campaign_days} дней</p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Стоимость кампании</p>
                      <p className="text-3xl font-bold text-primary">
                        {aiResponse.calculation.estimated_cost.toLocaleString()} ₽
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">🎁 Ролик в подарок</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Excel Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-4"
              >
                <Button
                  size="lg"
                  className="gradient-primary gap-2 rounded-full px-8 py-6 text-lg font-semibold hover:opacity-90 transition-all hover:scale-105"
                  onClick={handleExportExcel}
                >
                  <Download className="w-5 h-5" />
                  Скачать Excel
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MediaPlanner;
