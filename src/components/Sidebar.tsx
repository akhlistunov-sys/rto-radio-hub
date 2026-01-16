import { useState } from "react";
import { Phone, Mail, Send, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  audience: string;
  color: string;
  description: string;
  format: string;
}

const radioStations: RadioStation[] = [
  {
    id: "retro-fm",
    name: "Ретро FM",
    frequency: "89.0 МГц",
    audience: "30–55 лет",
    color: "bg-retro-fm",
    description: "Станция для ностальгических хитов, вызывающая сильный эмоциональный отклик у слушателей.",
    format: "Ностальгические хиты 70-90х",
  },
  {
    id: "radio-dacha",
    name: "Радио Дача",
    frequency: "105.9 МГц",
    audience: "35–65 лет",
    color: "bg-radio-dacha",
    description: "Семейный формат, ориентированный на уют и спокойствие для всей семьи.",
    format: "Семейный формат",
  },
  {
    id: "humor-fm",
    name: "Юмор FM",
    frequency: "93.9 МГц",
    audience: "25–45 лет",
    color: "bg-humor-fm",
    description: "Позитивный формат со смехом и легким настроением для активных слушателей.",
    format: "Юмор и хиты",
  },
  {
    id: "love-radio",
    name: "Love Radio",
    frequency: "88.1 / 92.2 МГц",
    audience: "18–35 лет",
    color: "bg-love-radio",
    description: "Драйвовая и романтичная станция для молодежи с современными хитами.",
    format: "Молодёжный формат",
  },
  {
    id: "shanson",
    name: "Радио Шансон",
    frequency: "101.0 МГц",
    audience: "30–60 лет",
    color: "bg-shanson",
    description: "Станция с «честными историями», которую предпочитают преимущественно мужчины.",
    format: "Русский шансон",
  },
  {
    id: "avtoradio",
    name: "Авторадио",
    frequency: "105.3 МГц",
    audience: "25–50 лет",
    color: "bg-avtoradio",
    description: "Музыка и новости для автомобилистов — всегда в курсе событий за рулём.",
    format: "Авто-формат",
  },
];

const Sidebar = () => {
  const [openStation, setOpenStation] = useState<string | null>(null);

  return (
    <aside className="w-72 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-1 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            Р
          </div>
          <div className="w-10 h-10 rounded-lg bg-radio-dacha flex items-center justify-center text-primary-foreground font-bold text-lg">
            Т
          </div>
          <div className="w-10 h-10 rounded-lg bg-retro-fm flex items-center justify-center text-primary-foreground font-bold text-lg">
            О
          </div>
        </div>
        <p className="text-sm font-semibold text-foreground">РАДИО ТЮМЕНСКОЙ ОБЛАСТИ</p>
        <p className="text-xs text-muted-foreground">Ялуторовск / Заводоуковск</p>
      </div>

      {/* Radio Stations */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {radioStations.map((station, index) => (
          <Collapsible
            key={station.id}
            open={openStation === station.id}
            onOpenChange={(isOpen) => setOpenStation(isOpen ? station.id : null)}
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full group p-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 cursor-pointer animate-fade-in text-left",
                  openStation === station.id && "bg-secondary/80"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full mt-1.5 ring-2 ring-offset-2 ring-offset-card transition-all",
                      station.color,
                      openStation === station.id ? "ring-primary" : "ring-transparent group-hover:ring-current"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {station.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{station.frequency}</p>
                    <p className="text-xs text-muted-foreground/70">{station.audience}</p>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      openStation === station.id && "rotate-180"
                    )} 
                  />
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <div className="ml-6 mr-2 mb-2 p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Формат</p>
                  <p className="text-xs text-foreground font-medium">{station.format}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Описание</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{station.description}</p>
                </div>
                <div className="pt-1">
                  <span className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white", station.color)}>
                    {station.audience}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Contact Info */}
      <div className="p-4 border-t border-border space-y-3">
        <a
          href="tel:+73453550151"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>8 (34535) 5-01-51</span>
        </a>
        <a
          href="mailto:yaradio@bk.ru"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>yaradio@bk.ru</span>
        </a>
        <a
          href="https://t.me/YaRadioBot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Telegram Bot</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
