CREATE TABLE destination (
    id_destination NUMBER NOT NULL,
    city           VARCHAR2(50) NOT NULL,
    country        VARCHAR2(50) NOT NULL,
    image_link     VARCHAR2(500) NOT NULL
);

ALTER TABLE destination ADD CONSTRAINT destination_pk PRIMARY KEY ( id_destination );

CREATE TABLE favorites (
    id_favorite        NUMBER NOT NULL,
    date_added         DATE NOT NULL,
    package_id_package NUMBER NOT NULL,
    users_id_users     NUMBER
);

ALTER TABLE favorites ADD CONSTRAINT favorites_pk PRIMARY KEY ( id_favorite );

CREATE TABLE package (
    id_package                 NUMBER NOT NULL,
    hotel_name                 VARCHAR2(100) NOT NULL,
    excursion                  VARCHAR2(100),
    transport_type             VARCHAR2(50) NOT NULL,
    guide_name                 VARCHAR2(50) NOT NULL,
    length                     NUMBER NOT NULL,
    global_rating              NUMBER NOT NULL,
    nb_ratings                 NUMBER NOT NULL,
    description                VARCHAR2(250),
    price                      NUMBER NOT NULL,
    destination_id_destination NUMBER NOT NULL,
    id_destination             NUMBER NOT NULL
);

CREATE UNIQUE INDEX package__idx ON
    package (
        destination_id_destination
    ASC );

ALTER TABLE package ADD CONSTRAINT package_pk PRIMARY KEY ( id_package );

CREATE TABLE reservation (
    id_reservation   NUMBER NOT NULL,
    reference_number NUMBER NOT NULL,
    reservation_date DATE NOT NULL,
    date_start       DATE NOT NULL,
    date_end         DATE NOT NULL,
    nb_travelers     NUMBER NOT NULL,
    price            NUMBER NOT NULL,
    status           VARCHAR2(50) NOT NULL,
    users_id_users   NUMBER NOT NULL,
    trip_id_trip     NUMBER NOT NULL,
    id_trip          NUMBER NOT NULL
);

CREATE UNIQUE INDEX reservation__idx ON
    reservation (
        trip_id_trip
    ASC );

ALTER TABLE reservation ADD CONSTRAINT reservation_pk PRIMARY KEY ( id_reservation );

CREATE TABLE reviews (
    id_review          NUMBER NOT NULL,
    rating             NUMBER NOT NULL,
    "COMMENT"          VARCHAR2(500) NOT NULL,
    publishing_date    DATE NOT NULL,
    users_id_users     NUMBER NOT NULL,
    package_id_package NUMBER NOT NULL
);

ALTER TABLE reviews ADD CONSTRAINT reviews_pk PRIMARY KEY ( id_review );

CREATE TABLE trip (
    id_trip            NUMBER NOT NULL,
    depart_date        TIMESTAMP NOT NULL,
    return_date        TIMESTAMP NOT NULL,
    package_id_package NUMBER NOT NULL
);

ALTER TABLE trip ADD CONSTRAINT trip_pk PRIMARY KEY ( id_trip );

CREATE TABLE users (
    id_users      NUMBER NOT NULL,
    first_name    VARCHAR2(50) NOT NULL,
    last_name     VARCHAR2(50) NOT NULL,
    username      VARCHAR2(50) NOT NULL,
    email         VARCHAR2(50) NOT NULL,
    password      VARCHAR2(100) NOT NULL,
    creation_date DATE NOT NULL
);

ALTER TABLE users ADD CONSTRAINT users_pk PRIMARY KEY ( id_users );

ALTER TABLE favorites
    ADD CONSTRAINT favorites_package_fk FOREIGN KEY ( package_id_package )
        REFERENCES package ( id_package );

ALTER TABLE favorites
    ADD CONSTRAINT favorites_users_fk FOREIGN KEY ( users_id_users )
        REFERENCES users ( id_users );

ALTER TABLE package
    ADD CONSTRAINT package_destination_fk FOREIGN KEY ( destination_id_destination )
        REFERENCES destination ( id_destination );

ALTER TABLE reservation
    ADD CONSTRAINT reservation_trip_fk FOREIGN KEY ( trip_id_trip )
        REFERENCES trip ( id_trip );

ALTER TABLE reservation
    ADD CONSTRAINT reservation_users_fk FOREIGN KEY ( users_id_users )
        REFERENCES users ( id_users );

ALTER TABLE reviews
    ADD CONSTRAINT reviews_package_fk FOREIGN KEY ( package_id_package )
        REFERENCES package ( id_package );

ALTER TABLE reviews
    ADD CONSTRAINT reviews_users_fk FOREIGN KEY ( users_id_users )
        REFERENCES users ( id_users );

ALTER TABLE trip
    ADD CONSTRAINT trip_package_fk FOREIGN KEY ( package_id_package )
        REFERENCES package ( id_package );