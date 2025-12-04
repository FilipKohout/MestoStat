CREATE TABLE IF NOT EXISTS unemployment_data (
    data_id SERIAL PRIMARY KEY,
    date_recorded DATE NOT NULL,
    municipality_id INT REFERENCES municipalities(municipality_id),
    unemployed_percent FLOAT NOT NULL,

    UNIQUE (date_recorded, municipality_id)
);

INSERT INTO statistics (table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
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

INSERT INTO statistics (table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
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