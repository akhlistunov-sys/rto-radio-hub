import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Download, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import OfferCard from "@/components/offer/OfferCard";
import { OFFER_STATIONS, SPOT_OPTIONS, DAY_OPTIONS, listPrice, makeSlug, formatRub, MANAGERS } from "@/lib/offer";
import { downloadElementPdf, shareLink } from "@/lib/offer-pdf";

const PaketManager = () => {
  const [stations, setStations] = useState<string[]>([]);
  const [company, setCompany] = useState("");
  const [spots, setSpots] = useState(10);
  const [days, setDays] = useState(30);
  const [customDays, setCustomDays] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [manager, setManager] = useState(MANAGERS[0].id);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Пакеты — РТО";
    const m = document.createElement("meta");
    m.name = "robots"; m.content = "noindex,nofollow";
    document.head.appendChild(m);
    return () => { m.remove(); };
  }, []);

  const list = listPrice(stations.length, spots, days);
  const final = price ? Number(price.replace(/\s/g, "")) || 0 : list;
  const offer = useMemo(() => ({
    company: company.trim() || null, stations, spots_per_day: spots, days, duration: 20,
    price_list: list, price_final: final, manager,
  }), [company, stations, spots, days, list, final, manager]);

  const toggle = (id: string) => setStations((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const valid = stations.length > 0 && days > 0;

  const send = async () => {
    if (!valid) return toast.error("Выберите хотя бы одну станцию");
    setBusy(true);
    const slug = makeSlug();
    const { error } = await supabase.from("offers").insert({ slug, ...offer });
    setBusy(false);
    if (error) return toast.error("Не удалось сохранить предложение");
    const url = `${window.location.origin}/p/${slug}`;
    const r = await shareLink(url, "Коммерческое предложение РТО");
    if (r === "copied") toast.success("Ссылка для клиента скопирована", { description: url });
  };

  const pdf = async () => {
    if (!valid || !cardRef.current) return toast.error("Выберите хотя бы одну станцию");
    setBusy(true);
    await downloadElementPdf(cardRef.current, `КП_РТО${company ? "_" + company : ""}.pdf`);
    setBusy(false);
  };

  const chip = (active: boolean) => cn("px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
    active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary");

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[400px_1fr] gap-6">
        <div className="space-y-6 rounded-3xl border border-border/50 bg-card p-5 h-fit lg:sticky lg:top-6">
          <h1 className="text-xl font-bold">Конструктор пакета</h1>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Радиостанции</p>
              <button className="text-xs text-primary" onClick={() => setStations(stations.length === 6 ? [] : OFFER_STATIONS.map((s) => s.id))}>
                {stations.length === 6 ? "Снять все" : "Выбрать все"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {OFFER_STATIONS.map((s) => {
                const on = stations.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggle(s.id)} className={cn("flex items-center gap-2 p-2 rounded-xl border text-left text-sm", on ? "border-primary bg-primary/10" : "border-border")}>
                    <img src={s.logo} alt="" className="w-8 h-8 rounded-lg object-contain bg-background" />
                    <span className="flex-1">{s.name}</span>
                    {on && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Выбор менеджера</p>
            <div className="flex flex-wrap gap-2">
              {MANAGERS.map((m) => <button key={m.id} className={chip(manager === m.id)} onClick={() => setManager(m.id)}>{m.name}</button>)}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Название фирмы <span className="text-muted-foreground">(необязательно)</span></p>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Например, АвтоВАЗ" maxLength={80} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Выходов в день</p>
            <div className="flex flex-wrap gap-2">
              {SPOT_OPTIONS.map((n) => <button key={n} className={chip(spots === n)} onClick={() => setSpots(n)}>{n}</button>)}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Дней кампании</p>
            <div className="flex flex-wrap gap-2">
              {DAY_OPTIONS.map((n) => <button key={n} className={chip(days === n && !customDays)} onClick={() => { setDays(n); setCustomDays(""); }}>{n}</button>)}
              <Input className="w-28" inputMode="numeric" placeholder="Вручную" value={customDays}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setCustomDays(v); if (v) setDays(Number(v)); }} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Стоимость кампании, ₽</p>
            <p className="text-xs text-muted-foreground">По прайсу: {formatRub(list)}</p>
            <Input inputMode="numeric" value={price} placeholder={String(list)}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} className="text-lg font-semibold" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={send} disabled={busy}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}Переслать клиенту</Button>
            <Button variant="outline" onClick={pdf} disabled={busy}><Download className="w-4 h-4 mr-2" />Скачать PDF</Button>
          </div>
        </div>

        <div>
          {valid ? <OfferCard ref={cardRef} offer={offer} /> : (
            <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">Выберите радиостанции — здесь появится предложение</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaketManager;
