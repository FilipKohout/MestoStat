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

    "0" INT DEFAULT 0,
    "1 - 4" INT DEFAULT 0,
    "5 - 9" INT DEFAULT 0,
    "10 - 14" INT DEFAULT 0,
    "15 - 19" INT DEFAULT 0,
    "20 - 24" INT DEFAULT 0,
    "25 - 29" INT DEFAULT 0,
    "30 - 34" INT DEFAULT 0,
    "35 - 39" INT DEFAULT 0,
    "40 - 44" INT DEFAULT 0,
    "45 - 49" INT DEFAULT 0,
    "50 - 54" INT DEFAULT 0,
    "55 - 59" INT DEFAULT 0,
    "60 - 64" INT DEFAULT 0,
    "65 - 69" INT DEFAULT 0,
    "70 - 74" INT DEFAULT 0,
    "75 - 79" INT DEFAULT 0,
    "80 - 84" INT DEFAULT 0,
    "85 - 89" INT DEFAULT 0,
    "90 - 94" INT DEFAULT 0,
    "95+" INT DEFAULT 0,

    UNIQUE (municipality_id, date_recorded)
);

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        2,
        'population_by_age_data',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Půlročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://data.csu.gov.cz'
    )
ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '0', '0'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '1 - 4', '1 - 4'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '5 - 9', '5 - 9'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '10 - 14', '10 - 14'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '15 - 19', '15 - 19'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '20 - 24', '20 - 24'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '25 - 29', '25 - 29'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '30 - 34', '30 - 34'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '35 - 39', '35 - 39'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '40 - 44', '40 - 44'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '45 - 49', '45 - 49'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '50 - 54', '50 - 54'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '55 - 59', '55 - 59'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '60 - 64', '60 - 64'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '65 - 69', '65 - 69'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '70 - 74', '70 - 74'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '75 - 79', '75 - 79'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '80 - 84', '80 - 84'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '85 - 89', '85 - 89'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '90 - 94', '90 - 94'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data'), '95+', '95+')
ON CONFLICT (table_id, column_name) DO NOTHING;




CREATE OR REPLACE VIEW population_by_age_data_age_grouped AS
SELECT
    data_id,
    municipality_id,
    date_recorded,
    "0" + "1 - 4" + "5 - 9" + "10 - 14" AS "0 - 14",
    "15 - 19" + "20 - 24" AS "15 - 24",
    "25 - 29" + "30 - 34" + "35 - 39" + "40 - 44" AS "25 - 44",
    "45 - 49" + "50 - 54" + "55 - 59" + "60 - 64" AS "45 - 64",
    "65 - 69" + "70 - 74" + "75 - 79" + "80 - 84" AS "65 - 84",
    "85 - 89" + "90 - 94" + "95+" AS "85+"
FROM population_by_age_data;

INSERT INTO statistics (table_id, table_name, last_updated, periodicity_id, structure_level_id, source_domain)
VALUES
    (
        3,
        'population_by_age_data_age_grouped',
        NOW(),
        (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'Půlročně'),
        (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'Obec'),
        'https://data.csu.gov.cz'
    )
    ON CONFLICT (table_name) DO NOTHING;

INSERT INTO statistic_columns (table_id, column_name, alias)
VALUES
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data_age_grouped'), '0 - 14', '0 - 14'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data_age_grouped'), '15 - 24', '15 - 24'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data_age_grouped'), '25 - 44', '25 - 44'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data_age_grouped'), '45 - 64', '45 - 64'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data_age_grouped'), '65 - 84', '65 - 84'),
    ((SELECT table_id FROM statistics WHERE table_name = 'population_by_age_data_age_grouped'), '85+', '85+')
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