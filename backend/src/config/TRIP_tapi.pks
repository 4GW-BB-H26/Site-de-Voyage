create or replace package trip_tapi as
/**
  * @author Tristan Tanguay
  * @version 1.0
  * @brief API PL/SQL pour l'entité TRIP - CRUD (SELECT, INSERT, UPDATE, DELETE)
  * @details Implémente des méthodes REST-like pour la table TRIP.
  */

 -- SELECT
   procedure select_trip (
      p_id_trip in trip.id_trip%type
   );

 -- INSERT
   procedure insert_trip (
      p_id_trip            in trip.id_trip%type,
      p_depart_date        in trip.depart_date%type,
      p_return_date        in trip.return_date%type,
      p_package_id_package in trip.package_id_package%type
   );

 -- UPDATE
   procedure update_trip (
      p_id_trip         in trip.id_trip%type,
      p_new_depart_date in trip.depart_date%type,
      p_new_return_date in trip.return_date%type,
      p_new_package_id  in trip.package_id_package%type
   );

 -- DELETE
   procedure delete_trip (
      p_id_trip in trip.id_trip%type
   );

end trip_tapi;