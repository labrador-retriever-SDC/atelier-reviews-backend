
DROP TABLE IF EXISTS characteristics_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id  SERIAL ,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR(255),
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  response VARCHAR(255),
  helpfulness INTEGER DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS photos (
  id  SERIAL ,
  review_id INTEGER
      REFERENCES reviews (id) ON DELETE CASCADE ON UPDATE CASCADE,
  url VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS characteristics (
  id  SERIAL ,
  product_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id  SERIAL ,
  char_id INTEGER NOT NULL
      REFERENCES characteristics (id),
  review_id INTEGER NOT NULL
      REFERENCES reviews (id),
  value DECIMAL(5,4) NOT NULL,
  PRIMARY KEY (id)
);

CREATE INDEX reviews_product_id ON reviews (product_id);
CREATE INDEX photos_review_id ON photos (review_id);
CREATE INDEX characteristics_product_id ON characteristics (product_id) ;
CREATE INDEX characteristics_reviews_char_id ON characteristics_reviews (char_id);
