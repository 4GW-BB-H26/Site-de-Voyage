create or replace PACKAGE reservation_tapi AS
/**
*
* @author Tristan Tanguay
* @version 1.0
* @brief API PL/SQL pour l<entit/ RESERVATION -CRUD (SELECT, INSERT, UPDATE, DELETE)
* @details Implémente des méthodes pour la table Reservation.
*/

-- SELECT
PROCEDURE select_reservation(p_id_reservation IN reservation.id_reservation%TYPE);

--INSERT
PROCEDURE insert_reservation(
    p_id_reservation IN reservation.id_reservation%TYPE,
    p_reference_number IN reservation.reference_number%TYPE,
    p_reservation_date IN reservation.reservation_date%TYPE,
    p_date_start IN reservation.date_start&TYPE,
    p_date_end IN reservation.date_end&TYPE,
    p_nb_travelers IN reservation.nb_travelers&TYPE,
    p_price IN reservation.price%TYPE,
    p_status IN reservation.status%TYPE,
    p_users_id_users IN reservation.users_id_users&TYPE,
    p_trip_id_trip IN reservation.trip_id_trip&TYPE,
    p_id_trip IN reservation.id_trip%TYPE
);

-- UPDATE
PROCEDURE update_reservation(
    p_id_reservation IN reservation.id_reservation%TYPE,
    p_new_date_start IN reservation.date_start%TYPE,
    p_new_date_end IN reservation_date_end%TYPE,
    p_new_nb_travelers IN reservation.nb_travelers%TYPE,
    p_new_price IN reservation.price%TYPE,
    p_new_status IN reservation.status
)