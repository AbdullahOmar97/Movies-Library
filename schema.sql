CREATE TABLE movie (
    id serial  PRIMARY KEY,
    title VARCHAR(255),
    release_date DATE,
    poster_path VARCHAR(255),
    overview text,
    comments  VARCHAR(255)
);

