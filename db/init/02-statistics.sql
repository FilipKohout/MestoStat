CREATE TABLE IF NOT EXISTS periodicities (
    periodicity_id SERIAL PRIMARY KEY,
    interval_months INT UNIQUE NOT NULL,
    periodicity_name VARCHAR(15) UNIQUE NOT NULL
);

INSERT INTO periodicities (periodicity_name, interval_months)
VALUES
    ('Ročně', 12),
    ('Půlročně', 6),
    ('Kvartálně', 3),
    ('Měsíčně', 1);

CREATE TABLE IF NOT EXISTS structure_levels (
    structure_level_id SERIAL PRIMARY KEY,
    identifier_column VARCHAR(50) UNIQUE NOT NULL,
    structure_level_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO structure_levels (structure_level_name, identifier_column)
VALUES
    ('Národně', 'nation_id'),
    ('Kraj', 'region_id'),
    ('Okres', 'district_id'),
    ('Obec', 'municipality_id');

CREATE TABLE IF NOT EXISTS statistics (
    table_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) UNIQUE NOT NULL,
    last_updated TIMESTAMP NOT NULL,
    source_domain VARCHAR(255) NOT NULL,
    periodicity_id INT REFERENCES periodicities(periodicity_id),
    structure_level_id INT REFERENCES structure_levels(structure_level_id)
);

CREATE TABLE statistic_columns (
   id SERIAL PRIMARY KEY,
   table_id INT NOT NULL REFERENCES statistics(table_id),
   column_name VARCHAR(100) NOT NULL,
   alias VARCHAR(100),
   aggregation_method VARCHAR(10) NOT NULL DEFAULT 'SUM', -- SUM, AVG, MAX, MIN, COUNT

   UNIQUE (table_id, column_name)
);