CREATE TABLE IF NOT EXISTS statistics (
    table_name VARCHAR(50) PRIMARY KEY,
    last_updated TIMESTAMP NOT NULL,
    periodicity VARCHAR(15) NOT NULL,
    structure_level VARCHAR(50) NOT NULL,
    source_domain VARCHAR(255) NOT NULL,

    CHECK ( periodicity IN ('annual', 'semi-annual', 'quarterly', 'monthly')),
    CHECK ( structure_level IN ('nation', 'region', 'district', 'municipality'))
);

CREATE TABLE IF NOT EXISTS population_by_sex_data (
    data_id SERIAL PRIMARY KEY,
    date_recorded DATE NOT NULL,
    municipality_id INT REFERENCES municipalities(municipality_id),
    males INT NOT NULL,
    females INT NOT NULL,

    UNIQUE (date_recorded, municipality_id)
);

INSERT INTO statistics (table_name, last_updated, periodicity, structure_level, source_domain)
VALUES
(
    'population_by_sex_data',
    NOW(),
    'semi-annual',
    'municipality',
    'https://data.csu.gov.cz'
)
ON CONFLICT (table_name) DO NOTHING;
