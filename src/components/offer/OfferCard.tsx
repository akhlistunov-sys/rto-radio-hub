import { forwardRef } from "react";
import { Radio, Users, TrendingDown, Calendar, Phone, Mail, Globe, MapPin, Mic } from "lucide-react";
import logoRTO from "@/assets/logo-rto.png";
import { OFFER_STATIONS, formatRub, offerReach, DEFAULT_DURATION, getManager } from "@/lib/offer";

export interface OfferData {
  company?: string | null;
  stations: string[];
  spots_per_day: number;
  days: number;
  duration?: number;
  price_list: number;
  price_final: number;
  manager?: string | null;
}

const Logo = ({ src, alt, size }: { src: string; alt: string; size: string }) => (
  <div className={`${size} shrink-0 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden p-1`}>
    <img src={src} alt={alt} style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }} />
  </div>
);

const OfferCard = forwardRef<HTMLDivElement, { offer: OfferData }>(({ offer }, ref) => {
  const stations = OFFER_STATIONS.filter((s) => offer.stations.includes(s.id));
  const reach = offerReach(offer.stations, offer.spots_per_day, offer.days);
  const totalSpots = stations.length * offer.spots_per_day * offer.days;
  const cpc = reach > 0 ? offer.price_final / reach : 0;
  const hasDiscount = offer.price_list > offer.price_final;
  const discountPct = hasDiscount ? Math.round((1 - offer.price_final / offer.price_list) * 100) : 0;
  const mgr = getManager(offer.manager);

  return (
    <div ref={ref} className="rounded-3xl border border-border/50 bg-card overflow-hidden">
      <div className="h-1.5 bg-primary" />
      <div className="p-5 md:p-8 space-y-7">
        <div className="flex items-center justify-between gap-4">
          <img src={logoRTO} alt="РТО" className="h-14 md:h-16 w-auto" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Коммерческое предложение</span>
        </div>

        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Mic className="w-4 h-4" /> Радиокампания
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {offer.company ? <>В эфире — <span className="text-primary">{offer.company}</span></> : "Ваш голос в эфире"}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Индивидуальный пакет на {stations.length} {stations.length === 1 ? "радиостанции" : "радиостанциях"}: ваш бренд услышат тысячи жителей каждый день.
          </p>
        </div>

        <div className="rounded-2xl bg-primary/10 border border-primary/30 p-5 md:p-7 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Стоимость кампании</p>
            {hasDiscount && <p className="text-lg text-muted-foreground line-through">{formatRub(offer.price_list)}</p>}
            <p className="text-4xl md:text-5xl font-bold text-primary">{formatRub(offer.price_final)}</p>
          </div>
          {hasDiscount && (
            <div className="md:text-right">
              <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">Скидка {discountPct}%</span>
              <p className="text-sm text-muted-foreground mt-2">Ваша экономия: <b className="text-foreground">{formatRub(offer.price_list - offer.price_final)}</b></p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Radio, label: "Радиостанций", value: stations.length },
            { icon: Calendar, label: "Дней в эфире", value: offer.days },
            { icon: Users, label: "Контактов с аудиторией", value: reach.toLocaleString("ru-RU") },
            { icon: TrendingDown, label: "Цена контакта", value: cpc.toFixed(2) + " ₽" },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-secondary/50 p-4">
              <m.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-xl md:text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground -mt-3">
          {offer.spots_per_day} выходов в день на каждой станции · всего {totalSpots.toLocaleString("ru-RU")} выходов в эфир
        </p>

        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Радиостанции в пакете</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {stations.map((s) => (
              <div key={s.id} className="flex gap-3 rounded-2xl border border-border/50 p-3 items-center">
                <Logo src={s.logo} alt={s.name} size="w-16 h-16" />
                <div>
                  <p className="font-semibold">{s.name} <span className="text-primary text-sm">{s.frequency}</span></p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary shrink-0" /> Ялуторовск и Заводоуковск · ролик до {offer.duration ?? DEFAULT_DURATION} секунд
        </p>

        <div className="rounded-2xl bg-secondary/50 p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Ваш менеджер</p>
            <p className="font-semibold text-base">{mgr.name}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" />{mgr.phone}</span>
            {mgr.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" />{mgr.email}</span>}
            <span className="inline-flex items-center gap-1.5"><Globe className="w-4 h-4 text-primary" />ya-radio.ru</span>
          </div>
        </div>
      </div>
    </div>
  );
});
OfferCard.displayName = "OfferCard";
export default OfferCard;
