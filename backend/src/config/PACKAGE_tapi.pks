create or replace package package_tapi is

-- creation de mes exception globale
   exception_destination_invalide exception;
   exception_prix_negatif exception;
   exception_package_introuvable exception;
   pragma exception_init ( exception_destination_invalide,-20001 );
   pragma exception_init ( exception_prix_negatif,-20002 );
   pragma exception_init ( exception_package_introuvable,-20003 );
   type package_tapi_rec is record (
         id_package                 number,
         hotel_name                 varchar2(100),
         excursion                  varchar2(100),
         transport_type             varchar2(50),
         guide_name                 varchar2(50),
         length                     number,
         global_rating              number,
         nb_ratings                 number,
         description                varchar2(250),
         price                      number,
         destination_id_destination number,
         id_destination             number
   );
   type package_tapi_tab is
      table of package_tapi_rec;

-- insert
   function ins_package (
      p_hotel_name                 varchar2,
      p_excursion                  varchar2,
      p_transport_type             varchar2,
      p_guide_name                 varchar2,
      p_length                     number,
      p_global_rating              number,
      p_nb_ratings                 number,
      p_description                varchar2,
      p_price                      number,
      p_destination_id_destination number,
      p_id_destination             number,
      p_test                       varchar2 default 'N'
   ) return varchar2;
-- update
   function upd_package (
      p_id_package                 number,
      p_hotel_name                 varchar2 default null,
      p_excursion                  varchar2 default null,
      p_transport_type             varchar2 default null,
      p_guide_name                 varchar2 default null,
      p_length                     number default null,
      p_global_rating              number default null,
      p_nb_ratings                 number default null,
      p_description                varchar2 default null,
      p_price                      number default null,
      p_destination_id_destination number default null,
      p_id_destination             number default null,
      p_test                       varchar2 default 'N'
   ) return varchar2;
-- delete
   function del_package (
      p_id_package in number,
      p_test       in varchar2 default 'N'
   ) return varchar2;
   function get_package (
      p_id_package in number
   ) return varchar2;

end package_tapi;
/
SHOW ERRORS;
