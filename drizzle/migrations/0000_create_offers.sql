CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  company text,
  stations text[] NOT NULL,
  spots_per_day int NOT NULL,
  days int NOT NULL,
  duration int NOT NULL DEFAULT 20,
  price_list numeric NOT NULL,
  price_final numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.offers TO anon, authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create offers" ON public.offers FOR INSERT TO anon, authenticated
  WITH CHECK (length(slug) >= 10 AND array_length(stations,1) BETWEEN 1 AND 6 AND days BETWEEN 1 AND 365 AND price_final >= 0);
CREATE OR REPLACE FUNCTION public.get_offer(_slug text)
RETURNS SETOF public.offers LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.offers WHERE slug = _slug LIMIT 1 $$;
GRANT EXECUTE ON FUNCTION public.get_offer(text) TO anon, authenticated;