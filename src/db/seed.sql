-- CREATE DATABASE reviews;
-- \c reviews

COPY reviews (product_id,rating,date,summary,body,recommend,reported,
reviewer_name,reviewer_email,response,helpfulness)
FROM '/tmp/data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos (review_id,url)
FROM '/tmp/data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics (product_id,name)
FROM '/tmp/data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews (characteristic_id,review_id,value)
FROM '/tmp/data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;



/* Navigate to the directory containing this file
 * Execute this file from the command line by typing:
 *    psql -U postgres -h localhost < seed.sql
 *  to create the database and the tables.*/