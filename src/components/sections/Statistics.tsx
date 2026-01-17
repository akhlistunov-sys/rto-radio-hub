import { BarChart3, Users, Radio, TrendingUp } from "lucide-react";

// Import logos
import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

const stats = [
  { label: "Охват аудитории", value: "150 000+", icon: Users, description: "слушателей ежедневно" },
  { label: "Радиостанций", value: "6", icon: Radio, description: "в 2 городах" },
  { label: "Лет на рынке", value: "15+", icon: TrendingUp, description: "успешной работы" },
  { label: "Рекламных кампаний", value: "1 200+", icon: BarChart3, description: "проведено" },
];

const audienceData = [
  { station: "Ретро FM", reach: 2596, logo: logoRetro },
  { station: "Радио Дача", reach: 2343, logo: logoDacha },
  { station: "Радио Шансон", reach: 2081, logo: logoShanson },
  { station: "Авторадио", reach: 2343, logo: logoAutoradio },
  { station: "Юмор FM", reach: 1514, logo: logoHumor },
  { station: "Love Radio", reach: 1009, logo: logoLove },
];

const maxReach = Math.max(...audienceData.map(d => d.reach));

const Statistics = () => {
  return (
    <section className="flex-1 p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
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
            {audienceData.map((item, index) => (
              <div 
                key={item.station} 
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.logo} 
                      alt={item.station}
                      className="w-8 h-8 object-contain rounded-lg bg-white"
                    />
                    <span className="font-medium text-foreground">{item.station}</span>
                  </div>
                  <span className="text-primary font-semibold">~{item.reach.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(item.reach / maxReach) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Возрастная группа</h3>
            <div className="space-y-3">
              {[
                { age: "18–25 лет", percent: 15 },
                { age: "25–35 лет", percent: 28 },
                { age: "35–45 лет", percent: 32 },
                { age: "45–55 лет", percent: 18 },
                { age: "55+ лет", percent: 7 },
              ].map((item) => (
                <div key={item.age} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.age}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10 text-right">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">География</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Ялуторовск</p>
                  <p className="text-sm text-muted-foreground">4 радиостанции</p>
                </div>
                <p className="text-2xl font-bold text-primary">65%</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div>
                  <p className="font-medium text-foreground">Заводоуковск</p>
                  <p className="text-sm text-muted-foreground">4 радиостанции</p>
                </div>
                <p className="text-2xl font-bold text-primary">35%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
