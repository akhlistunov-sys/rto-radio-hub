import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MediaPlannerRequest {
  query: string;
}

const systemPrompt = `Ты - эксперт по радиорекламе в агентстве "Радио Тюменской области" (РТО).
Твои города: Ялуторовск и Заводоуковск.

Список станций с аудиторией:
- Ретро FM (89.0 FM, Ялуторовск) — ~3600 слушателей, 35-55 лет, ностальгия, средний+ доход
- Радио Дача (105.9 FM, Ялуторовск) — ~3250 слушателей, 40-60 лет, сельская местность
- Юмор FM (93.9 FM, Ялуторовск) — ~2100 слушателей, 25-45 лет, активные, любят развлечения
- Love Radio (88.1 / 92.2 FM, Ялуторовск/Заводоуковск) — ~700 слушателей, 18-35 лет, молодежь
- Радио Шансон (101.0 FM, Заводоуковск) — ~2900 слушателей, 35-55 лет, мужчины, автолюбители
- Авторадио (105.3 FM, Заводоуковск) — ~3250 слушателей, 25-50 лет, автомобилисты

ВАЖНЫЕ ПРАВИЛА:
1. Рекомендуй от 4 до 6 радиостанций для максимального охвата
2. Рекомендуемая длительность кампании: 20-30 дней
3. Ролик (производство) — В ПОДАРОК, не включай в стоимость
4. Хронометраж ролика: 7-30 секунд

ФОРМУЛЫ РАСЧЁТА:
- spots_per_day = stations_count × slots_count (слотов обычно 8-10)
- total_spots = spots_per_day × campaign_days
- Тарифы (руб/сек): 1-2 станции = 1.5, 3-4 станции = 1.3, 5 станций = 1.2, 6 станций = 1.1
- cost_per_spot = duration × price_per_sec
- estimated_cost = cost_per_spot × total_spots
- Если 15 слотов — скидка 5%
- estimated_reach = sum(station_listeners) × sum(slot_coverage%) × 0.7

ВАЖНО: Отвечай ТОЛЬКО в формате JSON без markdown разметки. Структура:
{
  "strategy": {
    "title": "Название стратегии",
    "description": "Описание 2-3 предложения"
  },
  "recommendedStations": [
    {
      "name": "Название станции",
      "freq": "Частота",
      "reason": "Почему эта станция подходит"
    }
  ],
  "creative": {
    "tips": ["Совет 1", "Совет 2", "Совет 3"],
    "hooks": ["Крючок 1", "Крючок 2"]
  },
  "scripts": [
    {
      "title": "Название варианта",
      "duration": 20,
      "text": "Текст ролика до 20 секунд"
    }
  ],
  "calculation": {
    "stations_count": 4,
    "spots_per_day": 32,
    "campaign_days": 25,
    "total_spots": 800,
    "estimated_reach": 35000,
    "estimated_cost": 18200,
    "cost_per_contact": 0.52
  }
}

Рекомендуй 4-6 станций. Предоставь 3 варианта текстов роликов до 20 секунд. Расчёты по формулам выше.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query }: MediaPlannerRequest = await req.json();
    
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Клиент описывает свой бизнес: "${query}". Составь рекомендации по размещению рекламы. Помни: ролик в подарок, рекомендуй 4+ станций и 20-30 дней кампании.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Превышен лимит запросов. Попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Требуется пополнение баланса." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("Empty AI response");
    }

    // Parse JSON from AI response
    let parsedResponse;
    try {
      const cleanContent = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      parsedResponse = {
        strategy: {
          title: "Максимальный охват",
          description: "Комплексная стратегия размещения на 4+ станциях для максимального охвата целевой аудитории. Рекомендуем кампанию 20-30 дней."
        },
        recommendedStations: [
          { name: "Ретро FM", freq: "89.0", reason: "Широкий охват платежеспособной аудитории 35-55 лет" },
          { name: "Авторадио", freq: "105.3", reason: "Активная аудитория автомобилистов" },
          { name: "Радио Дача", freq: "105.9", reason: "Лояльная аудитория 40-60 лет" },
          { name: "Радио Шансон", freq: "101.0", reason: "Мужская аудитория с высокой лояльностью" }
        ],
        creative: {
          tips: ["Используйте яркий слоган", "Укажите контактные данные", "Добавьте призыв к действию"],
          hooks: ["Специальное предложение", "Только сейчас", "Скидка"]
        },
        scripts: [
          {
            title: "Информационный",
            duration: 20,
            text: "Ваш текст рекламного ролика. Ролик записываем бесплатно — это наш подарок!"
          }
        ],
        calculation: {
          stations_count: 4,
          spots_per_day: 32,
          campaign_days: 25,
          total_spots: 800,
          estimated_reach: 28000,
          estimated_cost: 16640,
          cost_per_contact: 0.59
        }
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Media planner error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
