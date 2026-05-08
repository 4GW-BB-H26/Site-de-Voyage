create table destination (
   id_destination number not null,
   city           varchar2(50) not null,
   country        varchar2(50) not null,
   image_link     varchar2(500) not null
);

alter table destination add constraint destination_pk primary key ( id_destination );

create table favorites (
   id_favorite        number not null,
   date_added         date not null,
   package_id_package number not null,
   users_id_users     number
);

alter table favorites add constraint favorites_pk primary key ( id_favorite );

create table package (
   id_package                 number not null,
   hotel_name                 varchar2(100) not null,
   excursion                  varchar2(100),
   transport_type             varchar2(50) not null,
   guide_name                 varchar2(50) not null,
   length                     number not null,
   global_rating              number not null,
   nb_ratings                 number not null,
   description                varchar2(250),
   price                      number not null,
   destination_id_destination number not null,
   id_destination             number not null
);

create unique index package__idx on
   package (
      destination_id_destination
   asc );

alter table package add constraint package_pk primary key ( id_package );

create table reservation (
   id_reservation   number not null,
   reference_number number not null,
   reservation_date date not null,
   date_start       date not null,
   date_end         date not null,
   nb_travelers     number not null,
   price            number not null,
   status           varchar2(50) not null,
   users_id_users   number not null,
   trip_id_trip     number not null,
   id_trip          number not null
);

create index reservation__idx on
   reservation (
      trip_id_trip
   asc );

alter table reservation add constraint reservation_pk primary key ( id_reservation );

create table reviews (
   id_review          number not null,
   rating             number not null,
   "COMMENT"          varchar2(500) not null,
   publishing_date    date not null,
   users_id_users     number not null,
   package_id_package number not null
);

alter table reviews add constraint reviews_pk primary key ( id_review );

create table trip (
   id_trip            number not null,
   depart_date        timestamp not null,
   return_date        timestamp not null,
   package_id_package number not null
);

alter table trip add constraint trip_pk primary key ( id_trip );

create table users (
   id_users      number not null,
   first_name    varchar2(50) not null,
   last_name     varchar2(50) not null,
   username      varchar2(50) not null,
   email         varchar2(50) not null,
   password      varchar2(100) not null,
   creation_date date not null
);

alter table users add constraint users_pk primary key ( id_users );

alter table favorites
   add constraint favorites_package_fk foreign key ( package_id_package )
      references package ( id_package );

alter table favorites
   add constraint favorites_users_fk foreign key ( users_id_users )
      references users ( id_users );

alter table package
   add constraint package_destination_fk foreign key ( destination_id_destination )
      references destination ( id_destination );

alter table reservation
   add constraint reservation_trip_fk foreign key ( trip_id_trip )
      references trip ( id_trip );

alter table reservation
   add constraint reservation_users_fk foreign key ( users_id_users )
      references users ( id_users );

alter table reviews
   add constraint reviews_package_fk foreign key ( package_id_package )
      references package ( id_package );

alter table reviews
   add constraint reviews_users_fk foreign key ( users_id_users )
      references users ( id_users );

alter table trip
   add constraint trip_package_fk foreign key ( package_id_package )
      references package ( id_package );