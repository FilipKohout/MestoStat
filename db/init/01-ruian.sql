CREATE TABLE IF NOT EXISTS regions (
    region_id SERIAL PRIMARY KEY,
    region_code_ruian VARCHAR(10) UNIQUE,
    region_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    district_id SERIAL PRIMARY KEY,
    district_code_ruian VARCHAR(10) UNIQUE,
    district_name VARCHAR(255) NOT NULL,
    region_id INT REFERENCES regions(region_id)
);

CREATE TABLE IF NOT EXISTS municipalities (
    municipality_id SERIAL PRIMARY KEY,
    municipality_name VARCHAR(255) UNIQUE,
    municipality_status VARCHAR(50) NOT NULL,
    district_id INT REFERENCES districts(district_id),
    region_id INT REFERENCES regions(region_id)
);