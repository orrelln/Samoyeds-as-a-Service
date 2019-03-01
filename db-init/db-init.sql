CREATE TABLE images
(
    id UUID PRIMARY KEY,
    ts TIMESTAMP,
    safe_mode BOOLEAN DEFAULT TRUE
);

CREATE TABLE predictions
(
    id UUID REFERENCES images(id),
    breed TEXT,
    percentage REAL,
    PRIMARY KEY(id, breed)
);

CREATE TABLE statuses
(
    id UUID PRIMARY KEY,
    status TEXT,
    ts TIMESTAMP,
    ip INET,
    queue_number INT
);

CREATE TABLE categories
(
    breed TEXT,
    category TEXT
);
