import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MediaPlanRequest {
  clientEmail: string;
  clientName: string;
  clientPhone?: string;
  mediaPlan: {
    strategy: {
      title: string;
      description: string;
    };
    recommendedStations: Array<{
      name: string;
      freq: string;
      reason: string;
    }>;
    creative: {
      tips: string[];
      hooks: string[];
    };
    scripts: Array<{
      title: string;
      duration: number;
      text: string;
    }>;
    calculation: {
      stations_count: number;
      spots_per_day: number;
      campaign_days: number;
      total_spots: number;
      estimated_reach: number;
      estimated_cost: number;
      cost_per_contact: number;
    };
  };
  originalQuery: string;
}

const ADMIN_EMAIL = "a.khlistunov@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientEmail, clientName, clientPhone, mediaPlan, originalQuery }: MediaPlanRequest = await req.json();

    if (!clientEmail || !clientName || !mediaPlan) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    // Generate HTML for media plan
    const mediaPlanHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C8208E;">Ваш медиаплан от РТО</h1>
        
        <h2 style="color: #333;">📊 Стратегия: ${mediaPlan.strategy.title}</h2>
        <p>${mediaPlan.strategy.description}</p>
        
        <h2 style="color: #333;">📻 Рекомендованные станции</h2>
        <ul>
          ${mediaPlan.recommendedStations.map(s => `
            <li><strong>${s.name}</strong> (${s.freq} FM) - ${s.reason}</li>
          `).join('')}
        </ul>
        
        <h2 style="color: #333;">💡 Креативные рекомендации</h2>
        <ul>
          ${mediaPlan.creative.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
        
        <h2 style="color: #333;">🎙️ Варианты текстов роликов</h2>
        ${mediaPlan.scripts.map((script, i) => `
          <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <h3>Вариант ${i + 1}: ${script.title} (${script.duration} сек)</h3>
            <p style="font-style: italic;">"${script.text}"</p>
          </div>
        `).join('')}
        
        <h2 style="color: #333;">💰 Предварительный расчёт</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #C8208E; color: white;">
            <td style="padding: 10px;">Параметр</td>
            <td style="padding: 10px;">Значение</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Количество станций</td>
            <td style="padding: 10px;">${mediaPlan.calculation.stations_count}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Выходов в день</td>
            <td style="padding: 10px;">${mediaPlan.calculation.spots_per_day}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Дней размещения</td>
            <td style="padding: 10px;">${mediaPlan.calculation.campaign_days}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Всего выходов</td>
            <td style="padding: 10px;">${mediaPlan.calculation.total_spots}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Охват аудитории</td>
            <td style="padding: 10px;">~${mediaPlan.calculation.estimated_reach.toLocaleString()} чел.</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">Стоимость кампании</td>
            <td style="padding: 10px; font-weight: bold; color: #C8208E;">${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽</td>
          </tr>
          <tr>
            <td style="padding: 10px;">Стоимость контакта</td>
            <td style="padding: 10px;">${mediaPlan.calculation.cost_per_contact.toFixed(2)} ₽</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
          <p style="margin: 0;"><strong>Для оформления заявки свяжитесь с нами:</strong></p>
          <p style="margin: 5px 0;">📞 8 (34535) 5-01-51</p>
          <p style="margin: 5px 0;">📧 yaradio@bk.ru</p>
          <p style="margin: 5px 0;">💬 <a href="https://t.me/YaRadioBot">Telegram</a></p>
        </div>
      </div>
    `;

    // Admin notification HTML
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C8208E;">🔔 Новая заявка с сайта!</h1>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Данные клиента:</h2>
          <p><strong>Имя:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          ${clientPhone ? `<p><strong>Телефон:</strong> ${clientPhone}</p>` : ''}
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Запрос клиента:</h2>
          <p style="font-style: italic;">"${originalQuery}"</p>
        </div>
        
        <h2>Сгенерированный медиаплан:</h2>
        <p><strong>Стратегия:</strong> ${mediaPlan.strategy.title}</p>
        <p><strong>Станции:</strong> ${mediaPlan.recommendedStations.map(s => s.name).join(', ')}</p>
        <p><strong>Расчётная стоимость:</strong> ${mediaPlan.calculation.estimated_cost.toLocaleString()} ₽</p>
        <p><strong>Охват:</strong> ~${mediaPlan.calculation.estimated_reach.toLocaleString()} чел.</p>
      </div>
    `;

    const results = { clientEmailSent: false, adminEmailSent: false };

    if (RESEND_API_KEY) {
      // Send to client
      try {
        const clientResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "РТО <onboarding@resend.dev>",
            to: [clientEmail],
            subject: "Ваш медиаплан от РТО готов!",
            html: mediaPlanHtml,
          }),
        });
        results.clientEmailSent = clientResponse.ok;
      } catch (e) {
        console.error("Failed to send client email:", e);
      }

      // Send to admin
      try {
        const adminResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "РТО Сайт <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            subject: `🔔 Новая заявка: ${clientName}`,
            html: adminHtml,
          }),
        });
        results.adminEmailSent = adminResponse.ok;
      } catch (e) {
        console.error("Failed to send admin email:", e);
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping emails");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Медиаплан сохранён",
        emailResults: results 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Send media plan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
