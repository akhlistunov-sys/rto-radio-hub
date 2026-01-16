import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MediaPlanner = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-primary">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Интеллектуальный медиапланер
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Опишите ваш бизнес или целевую аудиторию, и наш ИИ-помощник мгновенно предложит оптимальное решение для размещения рекламы.
          </p>
        </div>

        {/* Input Card */}
        <div className="glass-card p-6 space-y-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: У меня открывается новый магазин стройматериалов в Ялуторовске, кто мой слушатель?"
            className="min-h-[120px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
          
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-radio-dacha animate-pulse-soft" />
              <span>AI готов помочь</span>
            </div>
            <Button 
              className="gradient-primary gap-2 rounded-full px-6 hover:opacity-90 transition-opacity"
              disabled={!query.trim()}
            >
              <Send className="w-4 h-4" />
              Получить совет
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
              onClick={() => setQuery(`У меня бизнес в сфере "${suggestion}". Какие радиостанции подойдут?`)}
              className="px-4 py-2 text-sm rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaPlanner;
