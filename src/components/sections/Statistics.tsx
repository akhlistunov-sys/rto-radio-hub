import { BarChart3, Users, Radio, TrendingUp, Target } from "lucide-react";
import { STATIONS } from "@/lib/mediaplan";

const stats = [
  { label: "Охват аудитории", value: "~15,100", icon: Users, description: "слушателей ежедневно" },
  { label: "Радиостанций", value: "6", icon: Radio, description: "федерального уровня" },
  { label: "Лет на рынке", value: "10+", icon: TrendingUp, description: "успешной работы" },
  { label: "Кампаний в 2025", value: "200+", icon: BarChart3, description: "запущено" },
];

const reachData = [
  { title: "🎵 Ретро FM", range: "3,200-4,000", aud: "35-65 лет", desc: "Ядро взрослой аудитории" },
  { title: "🚗 Авторадио", range: "2,900-3,600", aud: "25-55 лет", desc: "Автомобилисты с доходом" },
  { title: "🏠 Радио Дача", range: "2,900-3,600", aud: "35-60 лет", desc: "Семейная аудитория" },
  { title: "🎸 Радио Шансон", range: "2,600-3,200", aud: "30-60+ лет", desc: "Мужская аудитория 30+" },
  { title: "🎭 Юмор FM", range: "1,800-2,400", aud: "25-45 лет", desc: "Активные 25+" },
  { title: "💖 Love Radio", range: "600-800", aud: "18-35 лет", desc: "Молодежь" }
];

const maxReach = Math.max(...STATIONS.map(s => s.listeners));

const Statistics = () => {
  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground uppercase tracking-tight">Статистика охвата</h1>
          <p className="text-muted-foreground">Реальные данные по аудитории региона Тюменской области</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="glass-card p-6 text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Audience Chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Охват аудитории по станциям (суточный)
          </h2>
          
          <div className="space-y-4">
            {STATIONS.map((station, index) => (
              <div 
                key={station.id} 
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img 
                      src={station.logo} 
                      alt={station.name}
                      className="w-8 h-8 object-contain rounded-lg bg-white"
                    />
                    <span className="font-medium text-foreground">{station.name}</span>
                    <span className="text-xs text-muted-foreground">({station.aud})</span>
                  </div>
                  <span className="text-primary font-semibold">~{station.listeners.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(station.listeners / maxReach) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Reach Data */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">
              Расчетные данные охвата
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reachData.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-secondary/50 border border-border hover:shadow-lg transition-all group"
              >
                <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm font-semibold text-primary mb-1">
                  {item.range} слушателей ({item.aud})
                </p>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Возрастная группа
            </h3>
            <div className="space-y-3">
              {[
                { age: "18–25 лет", percent: 12 },
                { age: "25–35 лет", percent: 24 },
                { age: "35–45 лет", percent: 28 },
                { age: "45–55 лет", percent: 22 },
                { age: "55+ лет", percent: 14 },
              ].map((item) => (
                <div key={item.age} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.age}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percent * 3}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              География
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Ялуторовск</p>
                  <p className="text-sm text-muted-foreground">4 радиостанции</p>
                </div>
                <p className="text-2xl font-bold text-primary">60%</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Заводоуковск</p>
                  <p className="text-sm text-muted-foreground">4 радиостанции</p>
                </div>
                <p className="text-2xl font-bold text-primary">40%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
