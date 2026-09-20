CREATE TABLE public.project_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  images_required SMALLINT NOT NULL,
  priority TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_connection TEXT NOT NULL,
  notified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.project_requests TO anon, authenticated;
GRANT ALL ON public.project_requests TO service_role;

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a project request"
ON public.project_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(first_name) BETWEEN 1 AND 100
  AND char_length(last_name) BETWEEN 1 AND 100
  AND char_length(business_name) BETWEEN 1 AND 160
  AND images_required BETWEEN 1 AND 6
  AND char_length(email) BETWEEN 3 AND 255
  AND char_length(phone) BETWEEN 4 AND 32
);