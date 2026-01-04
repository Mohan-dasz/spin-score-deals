-- Create leads table to store spin wheel entries
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  whatsapp_number TEXT NOT NULL UNIQUE,
  offer_id TEXT NOT NULL,
  offer_label TEXT NOT NULL,
  offer_discount TEXT NOT NULL,
  coupon_code TEXT,
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for lead generation (no auth required)
CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Allow public to check if whatsapp number already exists (for duplicate prevention)
CREATE POLICY "Anyone can check existing leads by whatsapp"
ON public.leads
FOR SELECT
USING (true);

-- Add index for faster whatsapp lookups
CREATE INDEX idx_leads_whatsapp ON public.leads(whatsapp_number);