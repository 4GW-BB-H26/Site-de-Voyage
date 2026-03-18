create or replace package reservation_tapi as
/**
*
* @author Tristan Tanguay
* @version 1.0
* @brief API PL/SQL pour l'entité RESERVATION -CRUD (SELECT, INSERT, UPDATE, DELETE)
* @details Implémente des méthodes pour la table Reservation.
*/

-- SELECT
   procedure select_reservation (
      p_id_reservation in reservation.id_reservation%type
   );

--INSERT
   procedure insert_reservation (
      p_id_reservation   in reservation.id_reservation%type,
      p_reference_number in reservation.reference_number%type,
      p_reservation_date in reservation.reservation_date%type,
      p_date_start       in reservation.date_start&type,
      p_date_end         in reservation.date_end&type,
      p_nb_travelers     in reservation.nb_travelers&type,
      p_price            in reservation.price%type,
      p_status           in reservation.status%type,
      p_users_id_users   in reservation.users_id_users&type,
      p_trip_id_trip     in reservation.trip_id_trip&type,
      p_id_trip          in reservation.id_trip%type
   );

-- UPDATE
   procedure update_reservation (
      p_id_reservation   in reservation.id_reservation%type,
      p_new_date_start   in reservation.date_start%type,
      p_new_date_end     in reservation_date_end%type,
      p_new_nb_travelers in reservation.nb_travelers%type,
      p_new_price        in reservation.price%type,
      p_new_status       in reservation.status
   );

-- DELETE
   procedure delete_reservation (
      p_id_reservation in reservation.id_reservation%type
   );

end reservation_tapi;