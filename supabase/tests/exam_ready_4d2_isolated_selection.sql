-- 4D-2 isolated SQL selection integration, run ONLY against disposable local Supabase.
-- Uses pg_temp fixtures: no application tables, question imports, or production writes.
BEGIN;
CREATE TEMP TABLE exam_ready_4d2_inventory (id integer PRIMARY KEY, domain text NOT NULL, scored_eligible boolean NOT NULL, unscored_eligible boolean NOT NULL);
INSERT INTO exam_ready_4d2_inventory
SELECT n, CASE WHEN n <= 274 THEN 'scientific_concepts' WHEN n <= 330 THEN 'implements_equipment' WHEN n <= 503 THEN 'hair_care_services' ELSE 'facial_hair_skin_care_services' END, true, true
FROM generate_series(1,573) n;
DO $test$
DECLARE
  trial integer;
  selected_count integer;
  distinct_count integer;
  scored_count integer;
  unscored_count integer;
  mismatches integer;
BEGIN
  FOR trial IN 1..1000 LOOP
    WITH scored_ranked AS (
      SELECT i.*, row_number() OVER (PARTITION BY domain ORDER BY gen_random_uuid()) AS domain_rank
      FROM exam_ready_4d2_inventory i WHERE scored_eligible
    ), scored AS (
      SELECT id, domain, true AS is_scored FROM scored_ranked s WHERE
      (s.domain = 'scientific_concepts' AND s.domain_rank <= 35) OR
      (s.domain = 'implements_equipment' AND s.domain_rank <= 10) OR
      (s.domain = 'hair_care_services' AND s.domain_rank <= 40) OR
      (s.domain = 'facial_hair_skin_care_services' AND s.domain_rank <= 15)
    ), unscored_ranked AS (
      SELECT i.id, i.domain, row_number() OVER (PARTITION BY i.domain ORDER BY gen_random_uuid()) AS experimental_rank
      FROM exam_ready_4d2_inventory i WHERE unscored_eligible AND NOT EXISTS (SELECT 1 FROM scored s WHERE s.id = i.id)
    ), unscored AS (
      SELECT id, domain, false AS is_scored FROM unscored_ranked u WHERE
      (u.domain = 'scientific_concepts' AND u.experimental_rank <= 4) OR
      (u.domain = 'implements_equipment' AND u.experimental_rank <= 1) OR
      (u.domain = 'hair_care_services' AND u.experimental_rank <= 4) OR
      (u.domain = 'facial_hair_skin_care_services' AND u.experimental_rank <= 1)
    ), picked AS (SELECT * FROM scored UNION ALL SELECT * FROM unscored),
    actual AS (SELECT domain, is_scored, count(*)::integer AS qty FROM picked GROUP BY domain, is_scored),
    expected(domain,is_scored,qty) AS (VALUES
      ('scientific_concepts',true,35),('implements_equipment',true,10),('hair_care_services',true,40),('facial_hair_skin_care_services',true,15),
      ('scientific_concepts',false,4),('implements_equipment',false,1),('hair_care_services',false,4),('facial_hair_skin_care_services',false,1))
    SELECT (SELECT count(*) FROM picked), (SELECT count(DISTINCT id) FROM picked),
      (SELECT count(*) FROM picked WHERE is_scored), (SELECT count(*) FROM picked WHERE NOT is_scored),
      (SELECT count(*) FROM expected e FULL JOIN actual a USING(domain,is_scored) WHERE e.qty IS DISTINCT FROM a.qty)
    INTO selected_count, distinct_count, scored_count, unscored_count, mismatches;
    IF selected_count <> 110 OR distinct_count <> 110 OR scored_count <> 100 OR unscored_count <> 10 OR mismatches <> 0 THEN
      RAISE EXCEPTION '4D-2 isolated SQL selection failure at trial %: total %, distinct %, scored %, experimental %, mismatch %', trial,selected_count,distinct_count,scored_count,unscored_count,mismatches;
    END IF;
  END LOOP;
  RAISE NOTICE '4D-2 isolated SQL selection: 1000 draws passed';
END $test$;
ROLLBACK;
