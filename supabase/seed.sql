insert into public.charities (
  id,
  name,
  slug,
  category,
  impact_tag,
  description,
  mission,
  featured,
  gallery_urls,
  total_raised_cents,
  active
)
values
  (
    '00000000-0000-0000-0000-000000000301',
    'First Swing Futures',
    'first-swing-futures',
    'Youth Access',
    'Open fair access to sport',
    'Funds coaching bursaries, travel grants, and safe beginner access for girls entering junior golf.',
    'Create real pathways into golf for children who normally never get onto a course.',
    true,
    '["/globe.svg","/window.svg"]'::jsonb,
    182400,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    'Blue Horizon Water Fund',
    'blue-horizon-water-fund',
    'Clean Water',
    'Every subscription extends a water line',
    'Builds small-scale water systems for drought-hit schools and rural sports programs.',
    'Keep children in school and sport by reducing time lost to unsafe water access.',
    false,
    '["/file.svg","/window.svg"]'::jsonb,
    146200,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    'Healing Greens Recovery Trust',
    'healing-greens-recovery-trust',
    'Mental Health',
    'Recovery spaces through movement',
    'Creates trauma-aware outdoor recovery programs for young adults rebuilding confidence after crisis care.',
    'Use movement, coaching, and calm outdoor environments to support recovery and social reconnection.',
    false,
    '["/next.svg","/globe.svg"]'::jsonb,
    98400,
    true
  )
on conflict (id) do nothing;

insert into public.charity_events (id, charity_id, title, summary, location, event_at)
values
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000301',
    'Community short-game clinic',
    'A free junior session led by volunteer coaches and adaptive-play mentors.',
    'Bengaluru',
    '2026-04-16T10:00:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000302',
    'Monsoon-proofing volunteer day',
    'Support field teams preparing filtration kits ahead of summer pressure peaks.',
    'Pune',
    '2026-05-03T10:00:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000303',
    'Mindful golf morning',
    'A low-pressure community day focused on confidence, movement, and conversation.',
    'Hyderabad',
    '2026-04-28T08:00:00Z'
  )
on conflict (id) do nothing;

insert into public.plans (
  id,
  name,
  cadence,
  base_amount_cents,
  yearly_savings_label,
  stripe_lookup_key,
  prize_pool_base_cents,
  base_charity_percent,
  enabled_tiers,
  country_code,
  currency_code,
  is_active
)
values
  (
    '00000000-0000-0000-0000-000000000501',
    'Momentum Monthly',
    'monthly',
    4900,
    null,
    'good_drive_monthly',
    1800,
    '10',
    '["10","15","20","25","30"]'::jsonb,
    'IN',
    'INR',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000502',
    'Impact Annual',
    'yearly',
    49900,
    'Save 15%',
    'good_drive_yearly',
    21600,
    '10',
    '["10","15","20","25","30"]'::jsonb,
    'IN',
    'INR',
    true
  )
on conflict (id) do nothing;
