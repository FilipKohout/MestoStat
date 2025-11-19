CREATE TABLE IF NOT EXISTS districts (
    district_id SERIAL PRIMARY KEY,
    district_name VARCHAR(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS municipalities (
    municipality_id SERIAL PRIMARY KEY,
    municipality_name VARCHAR(255) NOT NULL,
    municipality_status VARCHAR(50) NOT NULL,
    district_id INT REFERENCES districts(district_id),
    region_id INT REFERENCES regions(region_id),
);