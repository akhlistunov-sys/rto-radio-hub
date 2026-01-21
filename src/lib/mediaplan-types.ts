export interface MediaPlanStrategy {
  title: string;
  description: string;
}

export interface RecommendedStation {
  name: string;
  freq: string;
  reason: string;
}

export interface MediaPlanCreative {
  tips: string[];
  hooks: string[];
}

export interface MediaPlanScript {
  title: string;
  duration: number;
  text: string;
}

export interface MediaPlanCalculation {
  stations_count: number;
  spots_per_day: number;
  campaign_days: number;
  total_spots: number;
  estimated_reach: number;
  estimated_cost: number;
  cost_per_contact: number;
}

export interface MediaPlanResponse {
  strategy: MediaPlanStrategy;
  recommendedStations: RecommendedStation[];
  creative: MediaPlanCreative;
  scripts: MediaPlanScript[];
  calculation: MediaPlanCalculation;
}

export interface MediaPlanJSON {
  meta: {
    description: string;
    app_name: string;
    scenario: string;
    created_at: string;
    client_query: string;
  };
  input_data: {
    selected_radios: string[];
    selected_time_slots: number[];
    campaign_days: number;
    duration: number;
    production_option: string;
    production_cost: number;
  };
  constants_used: {
    station_listeners: Record<string, number>;
    total_listeners_base: number;
    price_tiers: Record<string, number>;
    applied_price_per_sec: number;
    min_budget: number;
  };
  intermediate_calculations: {
    spots_logic: {
      stations_count: number;
      slots_count: number;
      spots_per_day: number;
      total_spots_period: number;
    };
    financial_logic: {
      cost_per_spot_base: number;
      base_air_cost_total: number;
      premium_slots_count: number;
      is_max_coverage_bonus: boolean;
      time_multiplier: number;
      bonus_discount_percent: number;
      air_cost_after_discounts: number;
    };
    audience_logic: {
      sum_slots_coverage_percent: number;
      potential_daily_contacts: number;
      unique_factor: number;
      unique_daily_coverage: number;
    };
  };
  final_output: {
    financials: {
      base_price: number;
      discount: number;
      final_price: number;
      production_cost_included: number;
    };
    metrics: {
      daily_coverage_people: number;
      total_contacts_period: number;
      cost_per_contact: number;
    };
    display_strings: {
      price_text: string;
      reach_text: string;
      cpc_text: string;
    };
  };
  strategy: MediaPlanStrategy;
  creative: MediaPlanCreative;
  scripts: MediaPlanScript[];
}
