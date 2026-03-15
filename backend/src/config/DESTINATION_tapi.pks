create or replace package destination_tapi is
   type destination_tapi_rec is record (
         city           destination.city%type,
         id_destination destination.id_destination%type,
         country        destination.country%type,
         image_link     destination.image_link%type
   );
   type destination_tapi_tab is
      table of destination_tapi_rec;

    -- insert
   function ins_destination (
      p_city       in destination.city%type,
      p_country    in destination.country%type,
      p_image_link in destination.image_link%type,
      p_test       varchar2 default 'N'
   ) return varchar2;

    -- update
   function upd_destination (
      p_city           in destination.city%type default null,
      p_id_destination in destination.id_destination%type,
      p_country        in destination.country%type default null,
      p_image_link     in destination.image_link%type default null,
      p_test           varchar2 default 'N'
   ) return varchar2;

    -- Delete
   function del_destination (
      p_id_destination in destination.id_destination%type,
      p_test           varchar2 default 'N'
   ) return varchar2;

    -- get
   function get_destination (
      p_id_destination in destination.id_destination%type
   ) return varchar2;

end destination_tapi;