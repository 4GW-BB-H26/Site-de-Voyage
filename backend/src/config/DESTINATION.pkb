create or replace package body destination_tapi as



   procedure insert_destination (
      p_city           in destination.city%type,
      p_country        in destination.country%type,
      p_image_link     in destination.image_link%type,
      p_id_destination out destination.id_destination%type
   ) is
   begin
      insert into destination (
         city,
         country,
         image_link
      ) values ( p_city,
                 p_country,
                 p_image_link ) returning id_destination into p_id_destination;
      commit;
   end insert_destination;




   procedure update_destination (
      p_id_destination in destination.id_destination%type,
      p_city           in destination.city%type,
      p_country        in destination.country%type,
      p_image_link     in destination.image_link%type
   ) is
   begin
      update destination
         set city = p_city,
             country = p_country,
             image_link = p_image_link
       where id_destination = p_id_destination;
      commit;
   end update_destination;

   procedure delete_destination (
      p_id_destination in destination.id_destination%type
   ) is
   begin
      delete from destination
       where id_destination = p_id_destination;
      commit;
   end delete_destination;


end destination_tapi;