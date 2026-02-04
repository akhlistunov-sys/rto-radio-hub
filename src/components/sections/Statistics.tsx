import { BarChart3, Users, Radio, TrendingUp, Target, MapPin, Zap, CheckCircle, BookOpen } from "lucide-react";

// Import logos
import logoRetro from "@/assets/radio-retro.png";
import logoDacha from "@/assets/radio-dacha.jpg";
import logoHumor from "@/assets/radio-humor.png";
import logoLove from "@/assets/radio-love.png";
import logoShanson from "@/assets/radio-shanson.jpg";
import logoAutoradio from "@/assets/radio-autoradio.jpg";

const stationData = [
  { name: "Ретро FM", reach: "3 200 – 4 000", age: "35–65 лет", segment: "Взрослая лояльная аудитория", logo: logoRetro },
  { name: "Авторадио", reach: "2 900 – 3 600", age: "25–55 лет", segment: "Автомобилисты с доходом", logo: logoAutoradio },
  { name: "Радио Дача", reach: "2 900 – 3 600", age: "35–60 лет", segment: "Семейная аудитория", logo: logoDacha },
  { name: "Радио Шансон", reach: "2 600 – 3 200", age: "30–60+ лет", segment: "Мужская аудитория 30+", logo: logoShanson },
  { name: "Юмор FM", reach: "1 800 – 2 400", age: "25–45 лет", segment: "Активные люди 25+", logo: logoHumor },
  { name: "Love Radio", reach: "600 – 800", age: "18–35 лет", segment: "Молодежь и трендсеттеры", logo: logoLove },
];

const keyStats = [
  { value: "66 000+", label: "Суммарная аудитория", icon: Users },
  { value: "~20 000", label: "Слушателей в день", icon: Radio },
  { value: "3-5 ч", label: "Время прослушивания", icon: TrendingUp },
  { value: "68%", label: "Старше 35 лет", icon: Target },
];

const efficiencyStats = [
  { value: "~11 391", label: "Уникальный суточный охват (6 станций)" },
  { value: "~341 730", label: "Контактов за месяц" },
  { value: "0,17 ₽", label: "Стоимость контакта (CPC)" },
];

const sources = [
  "Mediascope — замеры аудитории российского радиорынка, 2024",
  "ВЦИОМ — социология радиопотребления в регионах",
  "RADIOPORTAL.RU — аналитика регионального вещания",
  "Собственные расчеты на основе численности населения (66,000 суммарно), возрастной структуры и зоны покрытия передатчиков (35 км радиус)",
];

const Statistics = () => {
  return (
    <section className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <BarChart3 className="w-4 h-4" />
            Аналитика
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Статистика и охват: цифры, которые работают на ваш бизнес
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Медиаплатформа «Радио Тюменской области» (РТО) — это не просто эфир, это ежедневный доступ к многотысячной аудитории юга региона.
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {keyStats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="glass-card p-4 text-center animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Station Table */}
        <div className="glass-card p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" />
            Портрет аудитории по радиостанциям
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Радиостанция</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium hidden sm:table-cell">Слушатели</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium hidden md:table-cell">Возраст</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Сегмент</th>
                </tr>
              </thead>
              <tbody>
                {stationData.map((station, index) => (
                  <tr 
                    key={station.name} 
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={station.logo} 
                          alt={station.name}
                          className="w-8 h-8 object-contain rounded-md bg-white"
                        />
                        <span className="font-medium text-foreground">{station.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-primary font-medium hidden sm:table-cell">{station.reach}</td>
                    <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{station.age}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs md:text-sm">{station.segment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Efficiency Stats */}
        <div className="glass-card p-4 md:p-6 bg-gradient-to-br from-primary/5 to-transparent">
          <h2 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Эффективность рекламного контакта
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Благодаря нашим алгоритмам расчета и пакетным предложениям, вы получаете максимально низкую стоимость взаимодействия с клиентом:
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {efficiencyStats.map((stat, index) => (
              <div key={stat.label} className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Geography */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-card p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Локальная специфика
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="font-medium text-foreground">Ялуторовск</p>
                <p className="text-sm text-muted-foreground">Высокая доля аудитории 45–65 лет</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50">
                <p className="font-medium text-foreground">Заводоуковск</p>
                <p className="text-sm text-muted-foreground">Преобладает активная аудитория 30–55 лет</p>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Общий тренд:</strong> 68% аудитории старше 35 лет с покупательной способностью
              </p>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Почему радио?
            </h3>
            <p className="text-sm text-muted-foreground">
              Радио — это платформа доверия и эмоций. В отличие от интернет-рекламы, которую часто игнорируют, 
              радиосообщение органично вплетается в контент, создавая устойчивую связь между вашим брендом и слушателем.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Демография городов определяет эффективность каждой радиостанции, а наши умные алгоритмы расчета 
              гарантируют максимальный охват по минимальной стоимости.
            </p>
          </div>
        </div>

        {/* Sources */}
        <div className="glass-card p-4 md:p-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Источники данных и исследования
          </h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {source}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4 italic">
            Данные актуальны на 2025 год и регулярно обновляются в соответствии с рыночными изменениями.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
