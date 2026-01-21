import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MediaPlannerRequest {
  query: string;
}

interface StationData {
  name: string;
  freq: string;
  city: string;
  listeners: number;
}

const stations: StationData[] = [
  { name: "Ретро FM", freq: "89.0", city: "Ялуторовск", listeners: 3600 },
  { name: "Радио Дача", freq: "105.9", city: "Ялуторовск", listeners: 3250 },
  { name: "Юмор FM", freq: "93.9", city: "Ялуторовск", listeners: 2100 },
  { name: "Love Radio", freq: "88.1 / 92.2", city: "Ялуторовск, Заводоуковск", listeners: 700 },
  { name: "Радио Шансон", freq: "101.0", city: "Заводоуковск", listeners: 2900 },
  { name: "Авторадио", freq: "105.3", city: "Заводоуковск", listeners: 3250 },
];

const systemPrompt = `Ты - эксперт по радиорекламе в агентстве "Радио Тюменской области" (РТО).
Твои города: Ялуторовск и Заводоуковск.

Список станций:
Ялуторовск: Ретро FM (89.0, ~3600 слушателей), Радио Дача (105.9, ~3250), Юмор FM (93.9, ~2100), Love Radio (88.1, ~700).
Заводоуковск: Шансон (101.0, ~2900), Авторадио (105.3, ~3250), Love Radio (92.2).

Целевые аудитории станций:
- Ретро FM: 35-55 лет, ностальгия, средний+ доход
- Радио Дача: 40-60 лет, сельская местность, загородные дома
- Юмор FM: 25-45 лет, активные, любят развлечения
- Love Radio: 18-35 лет, молодежь, романтика
- Шансон: 35-55 лет, мужчины, автолюбители
- Авторадио: 25-50 лет, автомобилисты, активный образ жизни

ВАЖНО: Отвечай ТОЛЬКО в формате JSON без markdown разметки. Структура ответа:
{
  "strategy": {
    "title": "Название стратегии",
    "description": "Описание стратегии 2-3 предложения"
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
    "stations_count": 3,
    "spots_per_day": 15,
    "campaign_days": 14,
    "total_spots": 210,
    "estimated_reach": 25000,
    "estimated_cost": 15000,
    "cost_per_contact": 0.60
  }
}

Рекомендуй от 2 до 4 станций в зависимости от бизнеса. 
Предоставь 3 варианта текстов роликов до 20 секунд каждый.
Расчеты делай реалистичными на основе выбранных станций.`;

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
          { role: "user", content: `Клиент описывает свой бизнес: "${query}". Составь рекомендации по размещению рекламы.` },
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
      // Remove potential markdown code blocks
      const cleanContent = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      // Return a fallback response
      parsedResponse = {
        strategy: {
          title: "Индивидуальная стратегия",
          description: "На основе вашего запроса мы подготовим персональное предложение. Свяжитесь с нашим менеджером для детальной консультации."
        },
        recommendedStations: [
          { name: "Ретро FM", freq: "89.0", reason: "Широкий охват аудитории" },
          { name: "Авторадио", freq: "105.3", reason: "Активная платежеспособная аудитория" }
        ],
        creative: {
          tips: ["Используйте яркий слоган", "Укажите контактные данные", "Добавьте призыв к действию"],
          hooks: ["Специальное предложение", "Только сейчас"]
        },
        scripts: [
          {
            title: "Информационный",
            duration: 20,
            text: "Ваш текст рекламного ролика. Обратитесь к менеджеру для составления профессионального сценария."
          }
        ],
        calculation: {
          stations_count: 2,
          spots_per_day: 10,
          campaign_days: 14,
          total_spots: 140,
          estimated_reach: 15000,
          estimated_cost: 12000,
          cost_per_contact: 0.80
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
