import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "a.khlistunov@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const { type } = data;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping emails");
      return new Response(
        JSON.stringify({ success: true, message: "No email key configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const now = new Date();
    const dateStr = now.toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' });

    // Admin notification from MediaPlanner Excel download
    if (type === "admin_notification") {
      const { planId, mediaPlan, originalQuery } = data;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h1 style="color: #C8208E;">🔔 Скачан медиаплан #${planId}</h1>
          <p>Кто-то скачал медиаплан с сайта.</p>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0;">💬 Запрос клиента:</h3>
            <p style="font-style: italic;">"${originalQuery || 'Не указан'}"</p>
          </div>
          
          <h3>📊 Стратегия: ${mediaPlan?.strategy?.title || 'N/A'}</h3>
          <p>${mediaPlan?.strategy?.description || ''}</p>
          
          <h3>📻 Станции:</h3>
          <ul>
            ${mediaPlan?.recommendedStations?.map((s: any) => `<li><strong>${s.name}</strong> (${s.freq} FM)</li>`).join('') || ''}
          </ul>
          
          <h3>💰 Расчёт:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Станций</td><td style="padding: 8px;">${mediaPlan?.calculation?.stations_count || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Выходов/день</td><td style="padding: 8px;">${mediaPlan?.calculation?.spots_per_day || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Всего выходов</td><td style="padding: 8px;">${mediaPlan?.calculation?.total_spots || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Охват</td><td style="padding: 8px;">~${mediaPlan?.calculation?.estimated_reach?.toLocaleString() || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd; background: #e8f5e9;"><td style="padding: 8px;"><strong>Стоимость</strong></td><td style="padding: 8px; font-weight: bold; color: #C8208E;">${mediaPlan?.calculation?.estimated_cost?.toLocaleString() || 0} ₽</td></tr>
            <tr><td style="padding: 8px;">Стоимость контакта</td><td style="padding: 8px;">${mediaPlan?.calculation?.cost_per_contact?.toFixed(2) || 0} ₽</td></tr>
          </table>
          
          <p style="margin-top: 20px; font-size: 12px; color: #999;">⏰ ${dateStr} (Екатеринбург)</p>
        </div>
      `;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "РТО Сайт <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            subject: `📥 Медиаплан #${planId} скачан | ${mediaPlan?.calculation?.estimated_cost?.toLocaleString() || 0} ₽`,
            html: adminHtml,
          }),
        });
      } catch (e) {
        console.error("Failed to send admin email:", e);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Admin notification from Calculator Excel download
    if (type === "admin_calculator_notification") {
      const { planId, clientData } = data;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h1 style="color: #C8208E;">🧮 Скачан расчёт #${planId}</h1>
          <p>Кто-то скачал расчёт из калькулятора.</p>
          
          <h3>📊 Параметры:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Радиостанции</td><td style="padding: 8px;">${clientData?.stations || ''}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Станций</td><td style="padding: 8px;">${clientData?.stationsCount || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Слотов</td><td style="padding: 8px;">${clientData?.slotsCount || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Дней</td><td style="padding: 8px;">${clientData?.days || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Хронометраж</td><td style="padding: 8px;">${clientData?.duration || 0} сек</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Выходов</td><td style="padding: 8px;">${clientData?.totalSpots || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px;">Охват</td><td style="padding: 8px;">~${clientData?.totalReach?.toLocaleString() || 0}</td></tr>
            <tr style="border-bottom: 1px solid #ddd; background: #e8f5e9;"><td style="padding: 8px;"><strong>Стоимость</strong></td><td style="padding: 8px; font-weight: bold; color: #C8208E;">${clientData?.finalPrice?.toLocaleString() || 0} ₽</td></tr>
            <tr><td style="padding: 8px;">₽/контакт</td><td style="padding: 8px;">${clientData?.costPerContact || 0} ₽</td></tr>
          </table>
          
          <p style="margin-top: 20px; font-size: 12px; color: #999;">⏰ ${dateStr} (Екатеринбург)</p>
        </div>
      `;

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "РТО Сайт <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            subject: `🧮 Расчёт #${planId} скачан | ${clientData?.finalPrice?.toLocaleString() || 0} ₽`,
            html: adminHtml,
          }),
        });
      } catch (e) {
        console.error("Failed to send admin email:", e);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown request type" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Send media plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
