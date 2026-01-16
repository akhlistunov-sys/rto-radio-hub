import { Phone, Mail, Send } from "lucide-react";

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  audience: string;
  color: string;
  icon?: React.ReactNode;
}

const radioStations: RadioStation[] = [
  {
    id: "retro-fm",
    name: "Ретро FM",
    frequency: "89.0 МГц",
    audience: "30–55 лет",
    color: "bg-retro-fm",
  },
  {
    id: "radio-dacha",
    name: "Радио Дача",
    frequency: "105.9 МГц",
    audience: "35–65 лет",
    color: "bg-radio-dacha",
  },
  {
    id: "humor-fm",
    name: "Юмор FM",
    frequency: "93.9 МГц",
    audience: "25–45 лет",
    color: "bg-humor-fm",
  },
  {
    id: "love-radio",
    name: "Love Radio",
    frequency: "88.1 / 92.2 МГц",
    audience: "18–35 лет",
    color: "bg-love-radio",
  },
  {
    id: "shanson",
    name: "Радио Шансон",
    frequency: "101.0 МГц",
    audience: "30–60 лет",
    color: "bg-shanson",
  },
  {
    id: "avtoradio",
    name: "Авторадио",
    frequency: "105.3 МГц",
    audience: "25–50 лет",
    color: "bg-avtoradio",
  },
];

const Sidebar = () => {
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
          <div
            key={station.id}
            className="group p-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-3 h-3 rounded-full ${station.color} mt-1.5 ring-2 ring-offset-2 ring-offset-card ring-transparent group-hover:ring-current transition-all`}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {station.name}
                </h3>
                <p className="text-xs text-muted-foreground">{station.frequency}</p>
                <p className="text-xs text-muted-foreground/70">{station.audience}</p>
              </div>
            </div>
          </div>
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
