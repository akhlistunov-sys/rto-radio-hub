import { Award, Users, Headphones, Target, Phone, Mail, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Target,
    title: "Точное таргетирование",
    description: "Подберём радиостанции под вашу целевую аудиторию с максимальной эффективностью"
  },
  {
    icon: Users,
    title: "Широкий охват",
    description: "Более 150 000 слушателей ежедневно в Ялуторовске и Заводоуковске"
  },
  {
    icon: Headphones,
    title: "6 радиостанций",
    description: "Разнообразие форматов для любой аудитории: от молодёжи до старшего поколения"
  },
  {
    icon: Award,
    title: "15+ лет опыта",
    description: "Знаем местный рынок и помогаем бизнесу расти через радиорекламу"
  },
];

const stations = [
  { name: "Ретро FM", freq: "89.0 МГц", audience: "30–55 лет", desc: "Ностальгические хиты", color: "bg-retro-fm" },
  { name: "Радио Дача", freq: "105.9 МГц", audience: "35–65 лет", desc: "Семейный формат", color: "bg-radio-dacha" },
  { name: "Юмор FM", freq: "93.9 МГц", audience: "25–45 лет", desc: "Позитив и смех", color: "bg-humor-fm" },
  { name: "Love Radio", freq: "88.1 / 92.2 МГц", audience: "18–35 лет", desc: "Романтика и драйв", color: "bg-love-radio" },
  { name: "Радио Шансон", freq: "101.0 МГц", audience: "30–60 лет", desc: "Честные истории", color: "bg-shanson" },
  { name: "Авторадио", freq: "105.3 МГц", audience: "25–50 лет", desc: "Для автомобилистов", color: "bg-avtoradio" },
];

const About = () => {
  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Рекламное агентство
            <span className="block text-primary">Радио Тюменской области</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ваш надёжный партнёр в радиорекламе. Помогаем бизнесу Ялуторовска и Заводоуковска 
            находить клиентов через эффективные рекламные кампании на радио.
          </p>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="glass-card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stations Grid */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Наши радиостанции</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map((station, index) => (
              <div 
                key={station.name}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-4 h-4 rounded-full ${station.color} mt-1`} />
                  <div>
                    <h4 className="font-semibold text-foreground">{station.name}</h4>
                    <p className="text-sm text-primary">{station.freq}</p>
                    <p className="text-xs text-muted-foreground mt-1">{station.desc}</p>
                    <p className="text-xs text-muted-foreground">Аудитория: {station.audience}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-8 gradient-hero">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Свяжитесь с нами</h2>
              <p className="text-muted-foreground mb-6">
                Готовы обсудить вашу рекламную кампанию? Свяжитесь с нами любым удобным способом.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="tel:+73453550151"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">8 (34535) 5-01-51</span>
                </a>
                
                <a 
                  href="mailto:yaradio@bk.ru"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">yaradio@bk.ru</span>
                </a>
                
                <a 
                  href="https://t.me/YaRadioBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Telegram Bot</span>
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    Р
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-radio-dacha flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    Т
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-retro-fm flex items-center justify-center text-primary-foreground font-bold text-2xl">
                    О
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm justify-center">
                  <MapPin className="w-4 h-4" />
                  <span>Ялуторовск • Заводоуковск</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
