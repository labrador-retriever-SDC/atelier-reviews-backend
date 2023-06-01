-- CREATE DATABASE reviews;
-- \c reviews

COPY reviews
FROM '/Users/ShuhuaL/Documents/HackReactor/SDC/atelier-reviews-backend/src/db/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos
FROM '/Users/ShuhuaL/Documents/HackReactor/SDC/atelier-reviews-backend/src/db/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics
FROM '/Users/ShuhuaL/Documents/HackReactor/SDC/atelier-reviews-backend/src/db/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews
FROM '/Users/ShuhuaL/Documents/HackReactor/SDC/atelier-reviews-backend/src/db/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;



/* Navigate to the directory containing this file
 * Execute this file from the command line by typing:
 *    psql -U postgres -h localhost < seed.sql
 *  to create the database and the tables.*/