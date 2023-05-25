-- CREATE DATABASE reviews;
\c reviews

DROP TABLE IF EXISTS characteristics_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id int PRIMARY KEY,
  product_id int,
  rating int NOT NULL,
  date bigint,
  summary varchar,
  body varchar(1000) NOT NULL,
  recommend bool NOT NULL,
  reported bool,
  reviewer_name varchar NOT NULL,
  reviewer_email varchar NOT NULL,
  response varchar,
  helpfulness int
);

CREATE TABLE photos (
  id int PRIMARY KEY,
  review_id int,
  url varchar
);

CREATE TABLE characteristics (
  id int PRIMARY KEY,
  product_id int,
  name varchar(65)
);

CREATE TABLE characteristics_reviews (
  id int PRIMARY KEY,
  char_id int,
  review_id int,
  value decimal(5, 4)
);

ALTER TABLE "photos" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");
ALTER TABLE "characteristics_reviews" ADD FOREIGN KEY ("char_id") REFERENCES "characteristics" ("id");

-- COPY reviews
-- FROM '/tmp/atelier-reviews-data/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY photos
-- FROM '/tmp/atelier-reviews-data/reviews_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics
-- FROM '/tmp/atelier-reviews-data/characteristics.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics_reviews
-- FROM '/tmp/atelier-reviews-data/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;


/* Navigate to the directory containing this file
 * Execute this file from the command line by typing:
 *    psql -U postgres -h localhost < schema.sql
 *  to create the database and the tables.*/