CREATE TABLE IF NOT EXISTS population_by_sex_data (
    data_id SERIAL PRIMARY KEY,
    date_recorded DATE NOT NULL,
    municipality_id INT REFERENCES municipalities(municipality_id),
    males INT NOT NULL,
    females INT NOT NULL,

    UNIQUE (date_recorded, municipality_id)
);

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        1,
        'population_by_sex_data',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Půlročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://data.csu.gov.cz'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_sex_data'), 'males', 'muži'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_sex_data'), 'females', 'ženy')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE TABLE population_by_age_data (
    data_id SERIAL PRIMARY KEY,
    municipality_id INT NOT NULL REFERENCES municipalities(municipality_id),
    date_recorded DATE NOT NULL,

    "0 - 14" INT DEFAULT 0,
    "15 - 64" INT DEFAULT 0,
    "65+" INT DEFAULT 0,

    UNIQUE (municipality_id, date_recorded)
);

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        2,
        'population_by_age_data',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Ročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://data.csu.gov.cz'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '0 - 14', '0 - 14'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '15 - 64', '14 - 64'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '65+', '65+')
ON CONFLICT (table_id, column_name) DO NOTHING;



CREATE TABLE population_movement_data (
    data_id SERIAL PRIMARY KEY,
    municipality_id INT NOT NULL REFERENCES municipalities(municipality_id),
    date_recorded DATE NOT NULL,
    population_total INT NOT NULL,
    births INT NOT NULL,
    deaths INT NOT NULL,
    immigrants INT NOT NULL,
    emigrants INT NOT NULL,

    UNIQUE (municipality_id, date_recorded)
);

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        4,
        'population_movement_data',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Ročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://csu.gov.cz/databaze-demografickych-udaju-za-obce-cr'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data'), 'population_total', 'total'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data'), 'births', 'narození'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data'), 'deaths', 'zemřelí'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data'), 'immigrants', 'přistěhovalí'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data'), 'emigrants', 'odstěhovalí')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE OR REPLACE VIEW population_movement_data_change AS
SELECT
    data_id,
    municipality_id,
    date_recorded,
    births,
    -deaths as deaths,
    immigrants,
    -emigrants as emigrants
FROM population_movement_data;

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        5,
        'population_movement_data_change',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Ročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://csu.gov.cz/databaze-demografickych-udaju-za-obce-cr'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data_change'), 'births', 'narození'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data_change'), 'deaths', 'zemřelí'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data_change'), 'immigrants', 'přistěhovalí'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_movement_data_change'), 'emigrants', 'odstěhovalí')
ON CONFLICT (table_id, column_name) DO NOTHING;

CREATE OR REPLACE VIEW population_data AS
SELECT
    pbsd.data_id,
    pbsd.date_recorded,
    pbsd.municipality_id,
    pbsd.males + pbsd.females AS total_population
FROM population_by_sex_data pbsd