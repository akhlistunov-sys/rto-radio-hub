import { Award, Users, Headphones, Target, Phone, Mail, Send, MapPin } from "lucide-react";
import { STATIONS } from "@/lib/mediaplan";

// Import logos
import logoRTO from "@/assets/logo-rto.png";

const features = [
  {
    icon: Target,
    title: "Точное таргетирование",
    description: "Подберём радиостанции под вашу целевую аудиторию с максимальной эффективностью"
  },
  {
    icon: Users,
    title: "Широкий охват",
    description: "Более 15 000 слушателей ежедневно в Ялуторовске и Заводоуковске"
  },
  {
    icon: Headphones,
    title: "6 радиостанций",
    description: "Федеральные станции для любой аудитории: от молодёжи до старшего поколения"
  },
  {
    icon: Award,
    title: "10+ лет опыта",
    description: "Знаем местный рынок и помогаем бизнесу расти через радиорекламу"
  },
];

const About = () => {
  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            О агентстве
            <span className="block text-primary">Радио Тюменской области</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ваш надёжный партнёр в радиорекламе с 2015 года. Помогаем бизнесу Ялуторовска и Заводоуковска 
            находить клиентов через эффективные рекламные кампании на радио.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">Мы в цифрах</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: "10+ лет", label: "работы на рынке" },
              { val: "200+", label: "кампаний в 2025" },
              { val: "6", label: "радиостанций" },
              { val: "~15,100", label: "ежедневный охват" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary leading-none tracking-tight">
                  {stat.val}
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
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
            {STATIONS.map((station, index) => (
              <div 
                key={station.id}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={station.logo} 
                    alt={station.name}
                    className="w-14 h-14 object-contain rounded-lg bg-white"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{station.name}</h4>
                    <p className="text-sm text-primary">{station.freq}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {station.cities.join(', ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Аудитория: {station.aud}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-8 bg-foreground text-background">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Контакты</h2>
              
              <div className="space-y-5">
                <a 
                  href="tel:+79220446644"
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-semibold">+7 (922) 044-66-44</span>
                </a>
                
                <a 
                  href="mailto:man@ya-radio.ru"
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-semibold">man@ya-radio.ru</span>
                </a>
                
                <a 
                  href="https://t.me/AlexeyKhlistunov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-semibold">Telegram: @AlexeyKhlistunov</span>
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <img src={logoRTO} alt="РТО" className="h-20 object-contain mx-auto mb-4 invert" />
                <div className="flex items-center gap-2 justify-center opacity-60">
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
