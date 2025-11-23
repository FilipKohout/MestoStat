CREATE TABLE IF NOT EXISTS periodicities (
    periodicity_id SERIAL PRIMARY KEY,
    periodicity_name VARCHAR(15) UNIQUE NOT NULL
);

INSERT INTO periodicities (periodicity_name)
VALUES
    ('annual'),
    ('semi-annual'),
    ('quarterly'),
    ('monthly');

CREATE TABLE IF NOT EXISTS structure_levels (
    structure_level_id SERIAL PRIMARY KEY,
    structure_level_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO structure_levels (structure_level_name)
VALUES
    ('nation'),
    ('region'),
    ('district'),
    ('municipality');

CREATE TABLE IF NOT EXISTS statistics (
    table_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) UNIQUE NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    source_domain VARCHAR(255) NOT NULL,
    periodicity_id INT REFERENCES periodicities(periodicity_id),
    structure_level_id INT REFERENCES structure_levels(structure_level_id)
);

CREATE TABLE IF NOT EXISTS population_by_sex_data (
    data_id SERIAL PRIMARY KEY,
    date_recorded DATE NOT NULL,
    municipality_id INT REFERENCES municipalities(municipality_id),
    males INT NOT NULL,
    females INT NOT NULL,

    UNIQUE (date_recorded, municipality_id)
);

    INSERT INTO statistics (table_name, last_updated, periodicity_id, structure_level_id, source_domain)
    VALUES
        (
            'population_by_sex_data',
            NOW(),
            (SELECT p.periodicity_id FROM periodicities p WHERE periodicity_name = 'semi-annual'),
            (SELECT s.structure_level_id FROM structure_levels s WHERE structure_level_name = 'municipality'),
            'https://data.csu.gov.cz'
        )
    ON CONFLICT (table_name) DO NOTHING;
