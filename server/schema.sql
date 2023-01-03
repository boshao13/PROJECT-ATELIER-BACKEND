DROP DATABASE IF EXISTS sdc_reviews;


CREATE DATABASE sdc_reviews;


\c sdc_reviews


CREATE TABLE IF NOT EXISTS photos (
id serial PRIMARY KEY,
review_id INT REFERENCES reviews(id),
url VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY ,
  product_id INTEGER NOT NULL ,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
   summary VARCHAR(200) NOT NULL,
  body VARCHAR(500) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response VARCHAR,
  helpfulness INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id serial PRIMARY KEY ,
  characteristic_id INTEGER NOT NULL ,
  review_id INT REFERENCES reviews(id) ,
  value INTEGER NOT NULL

);

CREATE TABLE IF NOT EXISTS characteristics (
  id serial PRIMARY KEY ,
  product_id INT  ,
  name VARCHAR NOT NULL
);


-- CREATE TABLE IF NOT EXISTS product (
--   id serial PRIMARY KEY,
--   product_id INTEGER NOT NULL REFERENCES results(product_id)
-- );






-- CREATE TABLE IF NOT EXISTS metadata (
--   product_id INTEGER NOT NULL PRIMARY KEY,
--   rating1 INTEGER NOT NULL,
--   rating2 INTEGER NOT NULL,
--   rating3 INTEGER NOT NULL,
--   rating4 INTEGER NOT NULL,
--   rating5 INTEGER NOT NULL,
--   recommended VARCHAR(200) NOT NULL,
--   recommend VARCHAR NOT NULL,
--   size_id INTEGER NOT NULL,
--   size_value DECIMAL NOT NULL,
--   width_id INTEGER NOT NULL,
--   width_value DECIMAL NOT NULL,
--   comfort_id INTEGER NOT NULL,
--   comfort_value DECIMAL NOT NULL
-- );
