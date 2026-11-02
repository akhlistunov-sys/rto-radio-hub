import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Share2, Sparkles, Calculator, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OfferCard, { OfferData } from "@/components/offer/OfferCard";
import { downloadElementPdf, shareLink } from "@/lib/offer-pdf";

const SITE = "https://ya-radio.ru/";

const OfferView = () => {
  const { slug } = useParams();
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Коммерческое предложение — РТО";
    supabase.rpc("get_offer", { _slug: slug ?? "" }).then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (row) { setOffer({ ...row, price_list: Number(row.price_list), price_final: Number(row.price_final) }); setState("ok"); }
      else setState("missing");
    });
  }, [slug]);

  if (state === "loading") return <div className="min-h-screen grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (state === "missing" || !offer) return (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div><p className="text-xl font-semibold mb-4">Предложение не найдено</p><Button asChild><a href={SITE}>На сайт</a></Button></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <OfferCard ref={ref} offer={offer} />
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" disabled={busy} onClick={async () => { setBusy(true); await downloadElementPdf(ref.current!, "КП_РТО.pdf"); setBusy(false); }}>
            <Download className="w-4 h-4 mr-2" />Скачать PDF
          </Button>
          <Button size="lg" variant="outline" onClick={async () => { if ((await shareLink(window.location.href, "Коммерческое предложение РТО")) === "copied") toast.success("Ссылка скопирована"); }}>
            <Share2 className="w-4 h-4 mr-2" />Переслать
          </Button>
        </div>
        <div className="rounded-3xl border border-border/50 bg-card p-5 space-y-3">
          <p className="font-semibold">Хотите рассчитать свой вариант?</p>
          <div className="grid sm:grid-cols-3 gap-2">
            <Button variant="secondary" asChild><a href={SITE}><Sparkles className="w-4 h-4 mr-2" />ИИ-помощник</a></Button>
            <Button variant="secondary" asChild><a href={SITE}><Calculator className="w-4 h-4 mr-2" />Расчёт вручную</a></Button>
            <Button variant="secondary" asChild><a href={SITE}><Globe className="w-4 h-4 mr-2" />Наш сайт</a></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferView;
