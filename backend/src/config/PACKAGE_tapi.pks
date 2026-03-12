create or replace package package_tapi is

-- creation de mes exception globale
   exception_destination_invalide exception;
   exception_prix_negatif exception;
   exception_package_introuvable exception;
   pragma exception_init ( exception_destination_invalide,-20001 );
   pragma exception_init ( exception_prix_negatif,-20002 );
   pragma exception_init ( exception_package_introuvable,-20003 );
   type package_tapi_rec is record (
         id_package                 "PACKAGE".id_package%type,
         hotel_name                 "PACKAGE".hotel_name%type,
         excursion                  "PACKAGE".excursion%type,
         transport_type             "PACKAGE".transport_type%type,
         guide_name                 "PACKAGE".guide_name%type,
         length                     "PACKAGE".length%type,
         global_rating              "PACKAGE".global_rating%type,
         nb_ratings                 "PACKAGE".nb_ratings%type,
         description                "PACKAGE".description%type,
         price                      "PACKAGE".price%type,
         destination_id_destination "PACKAGE".destination_id_destination%type,
         id_destination             "PACKAGE".id_destination%type
   );
   type package_tapi_tab is
      table of package_tapi_rec;

-- insert
   function ins_package (
      p_hotel_name                 "PACKAGE".hotel_name%type,
      p_excursion                  "PACKAGE".excursion%type,
      p_transport_type             "PACKAGE".transport_type%type,
      p_guide_name                 "PACKAGE".guide_name%type,
      p_length                     "PACKAGE".length%type,
      p_global_rating              "PACKAGE".global_rating%type,
      p_nb_ratings                 "PACKAGE".nb_ratings%type,
      p_description                "PACKAGE".description%type,
      p_price                      "PACKAGE".price%type,
      p_destination_id_destination "PACKAGE".destination_id_destination%type,
      p_id_destination             "PACKAGE".id_destination%type,
      p_test                       varchar2 default 'N'
   ) return varchar2;
-- update
   function upd_package (
      p_id_package                 "PACKAGE".id_package%type,
      p_hotel_name                 "PACKAGE".hotel_name%type default null,
      p_excursion                  "PACKAGE".excursion%type default null,
      p_transport_type             "PACKAGE".transport_type%type default null,
      p_guide_name                 "PACKAGE".guide_name%type default null,
      p_length                     "PACKAGE".length%type default null,
      p_global_rating              "PACKAGE".global_rating%type default null,
      p_nb_ratings                 "PACKAGE".nb_ratings%type default null,
      p_description                "PACKAGE".description%type default null,
      p_price                      "PACKAGE".price%type default null,
      p_destination_id_destination "PACKAGE".destination_id_destination%type default null,
      p_id_destination             "PACKAGE".id_destination%type default null,
      p_test                       varchar2 default 'N'
   ) return varchar2;
-- delete
   function del_package (
      p_id_package in "PACKAGE".id_package%type,
      p_test       in varchar2 default 'N'
   ) return varchar2;
   function get_package (
      p_id_package in "PACKAGE".id_package%type
   ) return varchar2;

end package_tapi;
/
SHOW ERRORS;
