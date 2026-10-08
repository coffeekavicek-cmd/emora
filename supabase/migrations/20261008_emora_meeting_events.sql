-- EMORA V25 - RUN ONLY AFTER THE OWNER REVIEWS AND APPROVES BOT DELIVERY.
-- Secret service-role key and Telegram token are NEVER saved in this file.
CREATE TABLE IF NOT EXISTS public.emora_meeting_events (
 dedupe_key text PRIMARY KEY CHECK (char_length(dedupe_key)=64),
 project_id uuid NOT NULL,
 owner_id uuid NOT NULL,
 site_slug text NOT NULL,
 choice text NOT NULL CHECK (choice IN ('restaurant','walk','coffee')),
 meet_date date NOT NULL,
 meet_time time NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
 telegram_message_id bigint,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (meet_date >= DATE '2025-01-01')
);
CREATE INDEX IF NOT EXISTS emora_meeting_events_owner_time
 ON public.emora_meeting_events(owner_id,created_at DESC);
ALTER TABLE public.emora_meeting_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.emora_meeting_events FROM anon, authenticated;
-- Service-role requests bypass RLS and supply owner id exclusively from verified DB owner.
-- No anonymous INSERT, SELECT or UPDATE grants/policies are created.
