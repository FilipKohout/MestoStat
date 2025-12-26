CREATE TABLE IF NOT EXISTS unemployment_data (
    data_id SERIAL PRIMARY KEY,
    date_recorded DATE NOT NULL,
    municipality_id INT REFERENCES municipalities(municipality_id),
    unemployed_percent FLOAT NOT NULL,

    UNIQUE (date_recorded, municipality_id)
);

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        6,
        'unemployment_data',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Ročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://data.csu.gov.cz'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias, aggregation_method)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'unemployment_data'), 'unemployed_percent', 'procento nezaměstnanosti', 'AVG')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE OR REPLACE VIEW unemployment_data_estimated_count AS
SELECT pbsd.data_id,
       pbsd.date_recorded,
       ud.municipality_id,
       (ud.unemployed_percent / 100) * (pbsd.males + pbsd.females) AS estimated_unemployed_count
FROM unemployment_data ud
JOIN population_by_sex_data pbsd on ud.municipality_id = pbsd.municipality_id
    AND extract(year from ud.date_recorded) = extract(year from pbsd.date_recorded);

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        7,
        'unemployment_data_estimated_count',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Půlročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://data.csu.gov.cz'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias, aggregation_method)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'unemployment_data_estimated_count'), 'estimated_unemployed_count', 'nezaměstnaní (odhad)', 'AVG')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE TABLE IF NOT EXISTS budget_expenses_data (
    data_id SERIAL PRIMARY KEY,
    municipality_id INT REFERENCES municipalities(municipality_id),
    date_recorded DATE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    actual_spending NUMERIC(15, 2) DEFAULT 0,
    budget_adjusted NUMERIC(15, 2) DEFAULT 0,

    UNIQUE (municipality_id, date_recorded, category_name)
);




CREATE OR REPLACE VIEW budget_expenses_data_detailed AS
SELECT
    municipality_id,
    date_recorded,

    -- ZEMĚDĚLSTVÍ A LESY
    SUM(CASE WHEN category_name = 'Zemědělství' THEN actual_spending ELSE 0 END) AS agriculture,
    SUM(CASE WHEN category_name = 'Lesní hospodářství' THEN actual_spending ELSE 0 END) AS forestry,

    -- DOPRAVA
    SUM(CASE WHEN category_name = 'Silnice' THEN actual_spending ELSE 0 END) AS roads,
    SUM(CASE WHEN category_name = 'Chodníky a cyklostezky' THEN actual_spending ELSE 0 END) AS sidewalks,
    SUM(CASE WHEN category_name = 'Veřejná doprava (MHD, Linky)' THEN actual_spending ELSE 0 END) AS public_transport,
    SUM(CASE WHEN category_name = 'Ostatní doprava' THEN actual_spending ELSE 0 END) AS transport_other,

    -- VODA
    SUM(CASE WHEN category_name = 'Pitná voda' THEN actual_spending ELSE 0 END) AS water_supply,
    SUM(CASE WHEN category_name = 'Kanalizace a ČOV' THEN actual_spending ELSE 0 END) AS sewage,
    SUM(CASE WHEN category_name = 'Vodní toky a díla' THEN actual_spending ELSE 0 END) AS watercourses,

    -- ŠKOLSTVÍ
    SUM(CASE WHEN category_name = 'Mateřské školy' THEN actual_spending ELSE 0 END) AS kindergarten,
    SUM(CASE WHEN category_name = 'Základní školy' THEN actual_spending ELSE 0 END) AS primary_school,
    SUM(CASE WHEN category_name = 'Školní stravování' THEN actual_spending ELSE 0 END) AS school_meals,
    SUM(CASE WHEN category_name = 'Základní umělecké školy' THEN actual_spending ELSE 0 END) AS art_school,
    SUM(CASE WHEN category_name IN ('Ostatní předškolní a základní', 'Střední a vyšší vzdělávání') THEN actual_spending ELSE 0 END) AS education_other,

    -- KULTURA
    SUM(CASE WHEN category_name = 'Knihovny' THEN actual_spending ELSE 0 END) AS libraries,
    SUM(CASE WHEN category_name = 'Kulturní domy a slavnosti' THEN actual_spending ELSE 0 END) AS culture_houses,
    SUM(CASE WHEN category_name = 'Památky a kulturní dědictví' THEN actual_spending ELSE 0 END) AS monuments,
    SUM(CASE WHEN category_name = 'Rozhlas a zpravodajství' THEN actual_spending ELSE 0 END) AS media,
    SUM(CASE WHEN category_name IN ('Muzea a galerie', 'Divadla a hudební činnost', 'Ostatní kultura') THEN actual_spending ELSE 0 END) AS culture_other,

    -- SPORT A VOLNÝ ČAS
    SUM(CASE WHEN category_name = 'Sportovní zařízení a činnost' THEN actual_spending ELSE 0 END) AS sport_facilities,
    SUM(CASE WHEN category_name = 'Dětská hřiště a parky' THEN actual_spending ELSE 0 END) AS playgrounds,
    SUM(CASE WHEN category_name = 'Střediska volného času (DDM)' THEN actual_spending ELSE 0 END) AS leisure_centers,

    -- BYDLENÍ A KOMUNÁLNÍ SLUŽBY
    SUM(CASE WHEN category_name = 'Veřejné osvětlení' THEN actual_spending ELSE 0 END) AS public_lighting,
    SUM(CASE WHEN category_name = 'Svoz a likvidace odpadů' THEN actual_spending ELSE 0 END) AS waste,
    SUM(CASE WHEN category_name = 'Veřejná zeleň' THEN actual_spending ELSE 0 END) AS greenery,
    SUM(CASE WHEN category_name = 'Bytové hospodářství (Obecní byty)' THEN actual_spending ELSE 0 END) AS municipal_housing,
    SUM(CASE WHEN category_name IN ('Komunální služby a územní rozvoj', 'Územní plánování') THEN actual_spending ELSE 0 END) AS communal_services,
    SUM(CASE WHEN category_name = 'Pohřebnictví' THEN actual_spending ELSE 0 END) AS funerals,

    -- SOCIÁLNÍ VĚCI (Opraveno rozdělení)
    SUM(CASE WHEN category_name = 'Domovy pro seniory' THEN actual_spending ELSE 0 END) AS senior_homes,
    SUM(CASE WHEN category_name = 'Pečovatelská služba' THEN actual_spending ELSE 0 END) AS care_service,
    SUM(CASE WHEN category_name = 'Služby pro rodiny a děti' THEN actual_spending ELSE 0 END) AS social_family,
    SUM(CASE WHEN category_name IN ('Služby pro handicapované', 'Ostatní sociální služby') THEN actual_spending ELSE 0 END) AS social_other,

    -- BEZPEČNOST
    SUM(CASE WHEN category_name = 'Hasiči (Dobrovolní)' THEN actual_spending ELSE 0 END) AS firefighters,
    SUM(CASE WHEN category_name = 'Městská policie' THEN actual_spending ELSE 0 END) AS police,
    SUM(CASE WHEN category_name IN ('Krizové řízení', 'Ostatní požární ochrana') THEN actual_spending ELSE 0 END) AS security_other,

    -- SPRÁVA A FINANCE
    SUM(CASE WHEN category_name = 'Platy zastupitelů' THEN actual_spending ELSE 0 END) AS council_salaries,
    SUM(CASE WHEN category_name = 'Provoz úřadu' THEN actual_spending ELSE 0 END) AS administration_office,
    SUM(CASE WHEN category_name = 'Volby' THEN actual_spending ELSE 0 END) AS elections,
    SUM(CASE WHEN category_name IN ('Bankovní poplatky a úroky', 'Pojištění majetku', 'Ostatní finanční operace') THEN actual_spending ELSE 0 END) AS financial_costs,

    -- OSTATNÍ (Agregované)
    SUM(CASE WHEN category_name IN ('Ostatní (Nespecifikováno)', 'Ostatní zemědělství', 'Ostatní bydlení a sítě', 'Ochrana životního prostředí', 'Ostatní správa', 'Zdravotnictví') THEN actual_spending ELSE 0 END) AS other_aggregated
FROM budget_expenses_data
GROUP BY municipality_id, date_recorded;

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES (8, 'budget_expenses_data_detailed', NOW(), (SELECT periodicity_id FROM periodicities WHERE periodicity_name = 'Ročně'), (SELECT structure_level_id FROM structure_levels WHERE structure_level_name = 'Obec'), 'https://monitor.statnipokladna.gov.cz')
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias, aggregation_method)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'agriculture', 'zemědělství', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'forestry', 'lesnictví', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'roads', 'silnice', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'sidewalks', 'chodníky a cyklostezky', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'public_transport', 'veřejná doprava', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'transport_other', 'ostatní doprava', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'water_supply', 'pitná voda', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'sewage', 'kanalizace a ČOV', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'watercourses', 'vodní toky', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'kindergarten', 'mateřské školy', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'primary_school', 'základní školy', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'school_meals', 'školní stravování', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'art_school', 'ZUŠ a umělecké školy', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'education_other', 'ostatní vzdělávání', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'libraries', 'knihovny', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'culture_houses', 'kulturní domy', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'monuments', 'památky', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'media', 'rozhlas a zpravodaj', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'culture_other', 'ostatní kultura', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'sport_facilities', 'sportoviště', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'playgrounds', 'dětská hřiště', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'leisure_centers', 'střediska volného času', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'public_lighting', 'veřejné osvětlení', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'waste', 'svoz odpadu', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'greenery', 'veřejná zeleň', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'municipal_housing', 'obecní byty', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'communal_services', 'komunální služby', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'funerals', 'pohřebnictví', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'senior_homes', 'domovy pro seniory', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'care_service', 'pečovatelská služba', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'social_family', 'rodina a děti', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'social_other', 'ostatní sociální služby', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'firefighters', 'hasiči', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'police', 'městská policie', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'security_other', 'krizové řízení', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'council_salaries', 'platy zastupitelů', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'administration_office', 'provoz úřadu', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'elections', 'volby', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'financial_costs', 'bankovní a finanční poplatky', 'SUM'),

    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_detailed'), 'other_aggregated', 'nespecifikované výdaje', 'SUM')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE OR REPLACE VIEW budget_expenses_data_summary AS
SELECT
    municipality_id,
    date_recorded,

    SUM(CASE WHEN category_name LIKE '%Silnice%' OR category_name LIKE '%Chodníky%' OR category_name LIKE '%doprava%'
                 THEN actual_spending ELSE 0 END) AS transport,

    SUM(CASE WHEN category_name IN ('Mateřské školy', 'Základní školy', 'Školní stravování', 'Základní umělecké školy', 'Ostatní předškolní a základní', 'Střední a vyšší vzdělávání')
                 THEN actual_spending ELSE 0 END) AS education,

    SUM(CASE WHEN category_name IN ('Pitná voda', 'Kanalizace a ČOV', 'Vodní toky a díla', 'Veřejné osvětlení', 'Bytové hospodářství (Obecní byty)', 'Ostatní bydlení a sítě', 'Komunální služby a územní rozvoj', 'Pohřebnictví')
                 THEN actual_spending ELSE 0 END) AS infrastructure_housing,

    SUM(CASE WHEN category_name IN ('Svoz a likvidace odpadů', 'Veřejná zeleň', 'Ochrana životního prostředí')
                 THEN actual_spending ELSE 0 END) AS environment,

    SUM(CASE WHEN category_name IN ('Knihovny', 'Muzea a galerie', 'Divadla a hudební činnost', 'Památky a kulturní dědictví', 'Rozhlas a zpravodajství', 'Kulturní domy a slavnosti', 'Ostatní kultura', 'Sportovní zařízení a činnost', 'Dětská hřiště a parky', 'Střediska volného času (DDM)')
                 THEN actual_spending ELSE 0 END) AS culture_sport,

    SUM(CASE WHEN category_name LIKE '%Sociální%' OR category_name LIKE '%Domovy%' OR category_name LIKE '%Pečovatelská%' OR category_name = 'Služby pro rodiny a děti' OR category_name = 'Služby pro handicapované' OR category_name = 'Zdravotnictví'
                 THEN actual_spending ELSE 0 END) AS social_health,

    SUM(CASE WHEN category_name IN ('Platy zastupitelů', 'Provoz úřadu', 'Volby', 'Ostatní správa', 'Krizové řízení', 'Městská policie', 'Hasiči (Dobrovolní)', 'Ostatní požární ochrana', 'Bankovní poplatky a úroky', 'Pojištění majetku', 'Ostatní finanční operace')
                 THEN actual_spending ELSE 0 END) AS admin_safety,

    SUM(CASE WHEN category_name IN ('Lesní hospodářství', 'Zemědělství', 'Ostatní zemědělství', 'Ostatní (Nespecifikováno)')
                 THEN actual_spending ELSE 0 END) AS other_economy
FROM budget_expenses_data
GROUP BY municipality_id, date_recorded;

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES (9, 'budget_expenses_data_summary', NOW(), (SELECT periodicity_id FROM periodicities WHERE periodicity_name = 'Ročně'), (SELECT structure_level_id FROM structure_levels WHERE structure_level_name = 'Obec'), 'https://monitor.statnipokladna.gov.cz')
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias, aggregation_method)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'transport', 'doprava', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'education', 'školství', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'infrastructure_housing', 'bydlení a infrastruktura', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'environment', 'životní prostředí', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'culture_sport', 'kultura a sport', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'social_health', 'sociální věci a zdraví', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'admin_safety', 'správa a bezpečnost', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_expenses_data_summary'), 'other_economy', 'ostatní hospodářství', 'SUM')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE TABLE IF NOT EXISTS budget_income_data (
    data_id SERIAL PRIMARY KEY,
    municipality_id INT NOT NULL REFERENCES municipalities(municipality_id),
    date_recorded DATE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    actual_income NUMERIC(15, 2) DEFAULT 0,
    budget_adjusted NUMERIC(15, 2) DEFAULT 0,

    UNIQUE (municipality_id, date_recorded, category_name)
);





CREATE OR REPLACE VIEW budget_income_data_summary AS
SELECT
    municipality_id,
    date_recorded,

    SUM(CASE WHEN category_name = 'Sdílené daně' THEN actual_income ELSE 0 END) AS tax_shared,
    SUM(CASE WHEN category_name = 'Daň z nemovitosti' THEN actual_income ELSE 0 END) AS tax_property,
    SUM(CASE WHEN category_name = 'Místní poplatky' THEN actual_income ELSE 0 END) AS tax_local_fees,
    SUM(CASE WHEN category_name = 'Ostatní daňové příjmy' THEN actual_income ELSE 0 END) AS tax_other,

    SUM(CASE WHEN category_name = 'Příjmy z pronájmu' THEN actual_income ELSE 0 END) AS non_tax_rent,
    SUM(CASE WHEN category_name = 'Příjmy z vlastní činnosti' THEN actual_income ELSE 0 END) AS non_tax_services,
    SUM(CASE WHEN category_name = 'Ostatní nedaňové příjmy' THEN actual_income ELSE 0 END) AS non_tax_other,

    SUM(CASE WHEN category_name = 'Prodej majetku' THEN actual_income ELSE 0 END) AS capital_sales,

    SUM(CASE WHEN category_name = 'Provozní dotace' THEN actual_income ELSE 0 END) AS subsidies_operational,
    SUM(CASE WHEN category_name = 'Investiční dotace' THEN actual_income ELSE 0 END) AS subsidies_investment
FROM budget_income_data
GROUP BY municipality_id, date_recorded;

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES (10, 'budget_income_data_summary', NOW(), (SELECT periodicity_id FROM periodicities WHERE periodicity_name = 'Ročně'), (SELECT structure_level_id FROM structure_levels WHERE structure_level_name = 'Obec'), 'https://monitor.statnipokladna.gov.cz')
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias, aggregation_method)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'tax_shared', 'sdílené daně (DPH, DPPO)', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'tax_property', 'daň z nemovitosti', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'tax_local_fees', 'místní poplatky', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'tax_other', 'ostatní daně', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'non_tax_rent', 'příjmy z pronájmu', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'non_tax_services', 'příjmy ze služeb', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'non_tax_other', 'ostatní nedaňové příjmy', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'capital_sales', 'prodej majetku', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'subsidies_operational', 'provozní dotace', 'SUM'),
    ((SELECT table_id FROM statistics WHERE table_name = 'budget_income_data_summary'), 'subsidies_investment', 'investiční dotace', 'SUM')
ON CONFLICT (table_id, column_name) DO NOTHING;