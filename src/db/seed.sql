-- CREATE DATABASE reviews;
\c reviews

COPY reviews
FROM '/tmp/atelier-reviews-data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos
FROM '/tmp/atelier-reviews-data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics
FROM '/tmp/atelier-reviews-data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews
FROM '/tmp/atelier-reviews-data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;



/* Navigate to the directory containing this file
 * Execute this file from the command line by typing:
 *    psql -U postgres -h localhost < seed.sql
 *  to create the database and the tables.*/