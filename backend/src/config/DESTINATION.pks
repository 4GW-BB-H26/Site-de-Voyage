create or replace package destination_tapi as
   procedure insert_destination (
      p_city           in destination.city%type,
      p_country        in destination.country%type,
      p_image_link     in destination.image_link%type,
      p_id_destination out destination.id_destination%type
   );
   procedure update_destination (
      p_id_destination in destination.id_destination%type,
      p_city           in destination.city%type,
      p_country        in destination.country%type,
      p_image_link     in destination.image_link%type
   );
   procedure delete_destination (
      p_id_destination in destination.id_destination%type
   );
end destination_tapi;