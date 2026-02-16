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
1. Выбирай количество радиостанций ГИБКО (от 3 до 6), ориентируясь на описание бизнеса клиента:
   - Малый/локальный бизнес, узкая ниша → 3-4 станции (наиболее релевантные)
   - Средний бизнес, широкая аудитория → 4-5 станций
   - Крупный бизнес, максимальный охват → 5-6 станций
2. Рекомендуемая длительность кампании: РОВНО 30 дней
3. Ролик (производство) — В ПОДАРОК, не включай в стоимость
4. Хронометраж ролика: 20 секунд

ФОРМУЛЫ РАСЧЁТА:
- campaign_days = 30 (всегда рекомендуем 30 дней)
- slots_count = количество временных слотов размещения (рекомендуй 7-10 слотов из 15 доступных)
- spots_per_day = stations_count × slots_count (МИНИМУМ 7 выходов в день на станцию, т.е. минимум slots_count = 7)
- total_spots = spots_per_day × campaign_days
- Тарифы (руб/сек): 1-2 станции = 1.5, 3-4 станции = 1.3, 5 станций = 1.2, 6 станций = 1.1
- cost_per_spot = duration × price_per_sec (duration = 20 сек)
- estimated_cost = cost_per_spot × total_spots
- Если 15 слотов — скидка 5%

Расчет охвата:
- Аудитория станций: Ретро FM=3600, Радио Дача=3250, Юмор FM=2100, Love Radio=700, Радио Шансон=2900, Авторадио=3250
- Проценты охвата по слотам: 06:00=6%, 07:00=10%, 08:00=12%, 09:00=8%, 10:00=7%, 11:00=6%, 12:00=5%, 13:00=5%, 14:00=5%, 15:00=6%, 16:00=7%, 17:00=10%, 18:00=8%, 19:00=4%, 20:00=4%
- total_coverage_percent = сумма процентов выбранных слотов / 100
- daily_reach = sum(station_listeners) × total_coverage_percent × 0.7
- estimated_reach = daily_reach × campaign_days
- cost_per_contact = estimated_cost / estimated_reach

ПРИМЕР РАСЧЁТА для 4 станций, 8 слотов:
- spots_per_day = 4 × 8 = 32
- total_spots = 32 × 30 = 960
- price_per_sec = 1.3 (3-4 станции)
- cost_per_spot = 20 × 1.3 = 26
- estimated_cost = 26 × 960 = 24,960 ₽
- sum_listeners = 3600+3250+2900+3250 = 13,000
- coverage_percent = (10+12+8+5+5+7+10+8)/100 = 0.65
- daily_reach = 13000 × 0.65 × 0.7 = 5,915
- estimated_reach = 5,915 × 30 = 177,450
- cost_per_contact = 24,960 / 177,450 = 0.14 ₽

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
    "slots_count": 8,
    "spots_per_day": 32,
    "campaign_days": 30,
    "total_spots": 960,
    "estimated_reach": 177450,
    "estimated_cost": 24960,
    "cost_per_contact": 0.14
  }
}

Подбирай количество станций ГИБКО под клиента (3-6). campaign_days ВСЕГДА = 30. slots_count от 7 до 15. Предоставь 3 варианта текстов роликов до 20 секунд. Рассчитывай по формулам выше, стоимость контакта должна быть в диапазоне 0.10-0.50 ₽.`;

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
          { role: "user", content: `Клиент описывает свой бизнес: "${query}". Составь рекомендации по размещению рекламы. ВАЖНО: ролик в подарок, подбери количество станций ГИБКО (3-6) под бизнес клиента, campaign_days ОБЯЗАТЕЛЬНО = 30 дней, slots_count от 7 до 15! Рассчитай всё строго по формулам.` },
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
          title: "Оптимальный охват",
          description: "Сбалансированная стратегия размещения для эффективного охвата целевой аудитории. Кампания на 30 дней с оптимальным набором станций."
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
          { title: "Информационный", duration: 20, text: "Ваш текст рекламного ролика. Ролик записываем бесплатно — это наш подарок!" },
          { title: "Акционный", duration: 20, text: "Внимание! Специальное предложение! Только сейчас..." },
          { title: "Имиджевый", duration: 20, text: "Надежность и качество — наш приоритет..." }
        ],
        calculation: {
          stations_count: 4,
          slots_count: 8,
          spots_per_day: 32,
          campaign_days: 30,
          total_spots: 960,
          estimated_reach: 177450,
          estimated_cost: 24960,
          cost_per_contact: 0.14
        }
      };
    }

    // Validate and recalculate to ensure correctness
    const calc = parsedResponse.calculation;
    const stationsCount = parsedResponse.recommendedStations?.length || calc.stations_count || 4;
    const slotsCount = calc.slots_count || Math.max(7, Math.ceil(calc.spots_per_day / stationsCount));
    
    // Recalculate using our formulas
    const spotsPerDay = stationsCount * slotsCount;
    const totalSpots = spotsPerDay * 30;
    
    let pricePerSec = 1.5;
    if (stationsCount >= 6) pricePerSec = 1.1;
    else if (stationsCount >= 5) pricePerSec = 1.2;
    else if (stationsCount >= 3) pricePerSec = 1.3;
    
    const costPerSpot = 20 * pricePerSec;
    const estimatedCost = Math.round(costPerSpot * totalSpots);
    
    // Calculate reach based on station listeners
    const LISTENERS: Record<string, number> = {
      "Ретро FM": 3600, "Радио Дача": 3250, "Юмор FM": 2100,
      "Love Radio": 700, "Радио Шансон": 2900, "Авторадио": 3250,
    };
    
    const totalListeners = parsedResponse.recommendedStations.reduce((sum: number, s: any) => {
      const key = Object.keys(LISTENERS).find(k => 
        k.toUpperCase() === s.name.toUpperCase() || s.name.toUpperCase().includes(k.toUpperCase())
      );
      return sum + (key ? LISTENERS[key] : 0);
    }, 0);
    
    // Use default slot coverage of ~65% for 8 slots
    const coveragePercent = Math.min(slotsCount * 0.07, 1.0);
    const dailyReach = Math.round(totalListeners * coveragePercent * 0.7);
    const estimatedReach = dailyReach * 30;
    const costPerContact = estimatedReach > 0 ? Math.round((estimatedCost / estimatedReach) * 100) / 100 : 0.14;
    
    // Override calculation with correct values
    parsedResponse.calculation = {
      stations_count: stationsCount,
      slots_count: slotsCount,
      spots_per_day: spotsPerDay,
      campaign_days: 30,
      total_spots: totalSpots,
      estimated_reach: estimatedReach,
      estimated_cost: estimatedCost,
      cost_per_contact: costPerContact,
    };

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
