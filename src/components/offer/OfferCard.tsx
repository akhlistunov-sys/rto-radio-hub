import { forwardRef } from "react";
import { Radio, Users, TrendingDown, Calendar, Gift } from "lucide-react";
import logoRTO from "@/assets/logo-rto.png";
import { OFFER_STATIONS, formatRub, offerReach, DEFAULT_DURATION } from "@/lib/offer";

export interface OfferData {
  company?: string | null;
  stations: string[];
  spots_per_day: number;
  days: number;
  duration?: number;
  price_list: number;
  price_final: number;
}

const OfferCard = forwardRef<HTMLDivElement, { offer: OfferData }>(({ offer }, ref) => {
  const stations = OFFER_STATIONS.filter((s) => offer.stations.includes(s.id));
  const reach = offerReach(offer.stations, offer.spots_per_day, offer.days);
  const totalSpots = stations.length * offer.spots_per_day * offer.days;
  const cpc = reach > 0 ? offer.price_final / reach : 0;
  const hasDiscount = offer.price_list > offer.price_final;
  const discountPct = hasDiscount ? Math.round((1 - offer.price_final / offer.price_list) * 100) : 0;

  return (
    <div ref={ref} className="rounded-3xl border border-border/50 bg-card p-5 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <img src={logoRTO} alt="РТО" className="h-10 object-contain" />
        <span className="text-xs md:text-sm text-muted-foreground">Коммерческое предложение</span>
      </div>

      <div>
        <h1 className="text-2xl md:text-4xl font-bold">
          {offer.company ? <>Пакет для <span className="text-primary">{offer.company}</span></> : "Рекламный пакет на радио"}
        </h1>
        <p className="text-muted-foreground mt-2">Ялуторовск и Заводоуковск · ролик до {offer.duration ?? DEFAULT_DURATION} секунд · изготовление ролика в подарок</p>
      </div>

      <div className="rounded-2xl bg-primary/10 border border-primary/30 p-5 md:p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">Стоимость кампании</p>
        {hasDiscount && (
          <p className="text-lg text-muted-foreground line-through">{formatRub(offer.price_list)}</p>
        )}
        <p className="text-4xl md:text-5xl font-bold text-primary">{formatRub(offer.price_final)}</p>
        {hasDiscount && (
          <span className="inline-block mt-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
            Ваша скидка {discountPct}% · экономия {formatRub(offer.price_list - offer.price_final)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Radio, label: "Радиостанций", value: stations.length },
          { icon: Calendar, label: "Дней кампании", value: offer.days },
          { icon: Users, label: "Контактов", value: reach.toLocaleString("ru-RU") },
          { icon: TrendingDown, label: "Цена контакта", value: cpc.toFixed(2) + " ₽" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl bg-secondary/50 p-4">
            <m.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-xl md:text-2xl font-bold">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {offer.spots_per_day} выходов в день на каждой станции · всего {totalSpots.toLocaleString("ru-RU")} выходов
      </p>

      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Радиостанции в пакете</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {stations.map((s) => (
            <div key={s.id} className="flex gap-3 rounded-2xl border border-border/50 p-3">
              <img src={s.logo} alt={s.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div>
                <p className="font-semibold">{s.name} <span className="text-primary text-sm">{s.frequency}</span></p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border/50 pt-4">
        <Gift className="w-4 h-4 text-primary" /> 8 (34535) 5-01-51 · yaradio@bk.ru · ya-radio.ru
      </div>
    </div>
  );
});
OfferCard.displayName = "OfferCard";
export default OfferCard;
