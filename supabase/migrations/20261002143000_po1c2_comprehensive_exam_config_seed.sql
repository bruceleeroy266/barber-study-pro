-- PO-1C.2 — Certified comprehensive-exam configuration seed
-- Question inventory is imported in domain-specific migrations that follow.
-- This remains database/content work only; no simulator runtime or UI.

insert into public.comprehensive_exam_configs (
  slug,
  version,
  title,
  status,
  blueprint_version,
  question_bank_version,
  scoring_policy_version,
  time_limit_seconds,
  passing_percentage,
  scored_question_count,
  unscored_question_count
)
values (
  'nic-barber-theory',
  1,
  'NIC Barber Theory Comprehensive Exam',
  'draft',
  'nic-barber-blueprint-2026-08-14',
  'po1c2-certified-bank-2026-10-02',
  'po1c-scoring-v1',
  null,
  null,
  100,
  10
)
on conflict (slug, version)
do update set
  title = excluded.title,
  blueprint_version = excluded.blueprint_version,
  question_bank_version = excluded.question_bank_version,
  scoring_policy_version = excluded.scoring_policy_version,
  scored_question_count = excluded.scored_question_count,
  unscored_question_count = excluded.unscored_question_count,
  updated_at = clock_timestamp();

with cfg as (
  select id
  from public.comprehensive_exam_configs
  where slug = 'nic-barber-theory' and version = 1
)
insert into public.comprehensive_exam_config_domains (
  config_id,
  domain,
  weight_percent,
  scored_question_count
)
select cfg.id, v.domain, v.weight_percent, v.scored_question_count
from cfg
cross join (
  values
    ('scientific_concepts'::text, 35, 35),
    ('implements_equipment'::text, 10, 10),
    ('hair_care_services'::text, 40, 40),
    ('facial_hair_skin_care_services'::text, 15, 15)
) as v(domain, weight_percent, scored_question_count)
on conflict (config_id, domain)
do update set
  weight_percent = excluded.weight_percent,
  scored_question_count = excluded.scored_question_count;

comment on table public.comprehensive_exam_questions is
  'Private PO-1C comprehensive-exam question registry. Question answer keys are not directly exposed to ordinary authenticated users.';
