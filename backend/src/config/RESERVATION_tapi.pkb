create or replace package body reservation_tapi as

  /**
   * Description   Récupère les informations d'une réservation à partir de son identifiant.
   *
   * @version      1.0.0
   * @example      reservation_tapi.select_reservation(1);
   * @author       Tristan Tanguay
   * @created      2026-03-16
   * @param        p_id_reservation   Identifiant unique de la réservation à récupérer.
   */
   procedure select_reservation (
      p_id_reservation in reservation.id_reservation%type
   ) is
      rec_r reservation%rowtype;
   begin
      select *
        into rec_r
        from reservation
       where id_reservation = p_id_reservation;

      logger.log_information(
         'reservation_tapi.select_reservation',
         'Réservation trouvée ID='
         || rec_r.id_reservation
         || ', reference='
         || rec_r.reference_number
         || ', status='
         || rec_r.status
      );

      dbms_output.put_line('Réservation '
                           || rec_r.id_reservation
                           || ': '
                           || rec_r.reference_number
                           || ' - ' || rec_r.status);

   exception
      when no_data_found then
         logger.log_warning(
            'reservation_tapi.select_reservation',
            'Aucune réservation trouvée pour id=' || p_id_reservation
         );
         dbms_output.put_line('Aucune réservation trouvée pour id=' || p_id_reservation);
      when others then
         logger.log_error(
            'reservation_tapi.select_reservation',
            'Erreur SQL: ' || sqlerrm
         );
         raise;
   end select_reservation;
----------------------------------------------------------------------------------------------------------------------------

  /**
   * Description   Crée une nouvelle réservation dans la base de données.
   *
   * @version      1.0.0
   * @example      reservation_tapi.insert_reservation(1, 100001, SYSDATE, SYSDATE+10, SYSDATE+17, 2, 1850, 'À venir', 1, 1, 1);
   * @author       Tristan Tanguay
   * @created      2026-03-16
   * @param        p_id_reservation   Identifiant de la réservation à créer.
   * @param        p_reference_number Numéro de référence unique de la réservation.
   * @param        p_reservation_date Date à laquelle la réservation a été effectuée.
   * @param        p_date_start       Date de début du voyage.
   * @param        p_date_end         Date de fin du voyage.
   * @param        p_nb_travelers     Nombre de voyageurs.
   * @param        p_price            Prix total de la réservation.
   * @param        p_status           Statut de la réservation.
   * @param        p_users_id_users   Identifiant de l'utilisateur associé.
   * @param        p_trip_id_trip     Identifiant du voyage associé (FK).
   * @param        p_id_trip          Identifiant du voyage associé.
   */
   procedure insert_reservation (
      p_id_reservation   in reservation.id_reservation%type,
      p_reference_number in reservation.reference_number%type,
      p_reservation_date in reservation.reservation_date%type,
      p_date_start       in reservation.date_start%type,
      p_date_end         in reservation.date_end%type,
      p_nb_travelers     in reservation.nb_travelers%type,
      p_price            in reservation.price%type,
      p_status           in reservation.status%type,
      p_users_id_users   in reservation.users_id_users%type,
      p_trip_id_trip     in reservation.trip_id_trip%type,
      p_id_trip          in reservation.id_trip%type
   ) is
   begin
      insert into reservation (
         id_reservation,
         reference_number,
         reservation_date,
         date_start,
         date_end,
         nb_travelers,
         price,
         status,
         users_id_users,
         trip_id_trip,
         id_trip
      ) values ( p_id_reservation,
                 p_reference_number,
                 p_reservation_date,
                 p_date_start,
                 p_date_end,
                 p_nb_travelers,
                 p_price,
                 p_status,
                 p_users_id_users,
                 p_trip_id_trip,
                 p_id_trip );

      commit;
      logger.log_information(
         'reservation_tapi.insert_reservation',
         'Réservation créée avec succès : ID=' || p_id_reservation
      );
      dbms_output.put_line('Réservation créée ID=' || p_id_reservation);
   exception
      when dup_val_on_index then
         logger.log_warning(
            'reservation_tapi.insert_reservation',
            'Réservation déjà existante ID=' || p_id_reservation
         );
         raise_application_error(
            -20020,
            'Réservation déjà existante: ' || p_id_reservation
         );
      when value_error then
         logger.log_error(
            'reservation_tapi.insert_reservation',
            'Erreur de type de valeur : ' || sqlerrm
         );
         raise;
      when others then
         logger.log_error(
            'reservation_tapi.insert_reservation',
            'Erreur SQL: ' || sqlerrm
         );
         rollback;
         raise;
   end insert_reservation;
----------------------------------------------------------------------------------------------------------------------------

  /**
   * Description   Met à jour les informations d'une réservation existante.
   *
   * @version      1.0.0
   * @example      reservation_tapi.update_reservation(1, SYSDATE+15, SYSDATE+22, 3, 2200, 'Validée');
   * @author       Tristan Tanguay
   * @created      2026-03-16
   * @param        p_id_reservation   Identifiant de la réservation à modifier.
   * @param        p_new_date_start   Nouvelle date de début du voyage.
   * @param        p_new_date_end     Nouvelle date de fin du voyage.
   * @param        p_new_nb_travelers Nouveau nombre de voyageurs.
   * @param        p_new_price        Nouveau prix total.
   * @param        p_new_status       Nouveau statut de la réservation.
   */
   procedure update_reservation (
      p_id_reservation   in reservation.id_reservation%type,
      p_new_date_start   in reservation.date_start%type,
      p_new_date_end     in reservation.date_end%type,
      p_new_nb_travelers in reservation.nb_travelers%type,
      p_new_price        in reservation.price%type,
      p_new_status       in reservation.status%type
   ) is
   begin
      update reservation
         set date_start = p_new_date_start,
             date_end = p_new_date_end,
             nb_travelers = p_new_nb_travelers,
             price = p_new_price,
             status = p_new_status
       where id_reservation = p_id_reservation;

      if sql%rowcount = 0 then
         logger.log_warning(
            'reservation_tapi.update_reservation',
            'Aucun enregistrement trouvé pour id=' || p_id_reservation
         );
         raise_application_error(
            -20021,
            'Aucune réservation trouvée pour id=' || p_id_reservation
         );
      else
         commit;
         logger.log_information(
            'reservation_tapi.update_reservation',
            'Réservation mise à jour avec succès ID=' || p_id_reservation
         );
         dbms_output.put_line('Réservation mise à jour ID=' || p_id_reservation);
      end if;

   exception
      when others then
         logger.log_error(
            'reservation_tapi.update_reservation',
            'Erreur SQL: ' || sqlerrm
         );
         rollback;
         raise;
   end update_reservation;
----------------------------------------------------------------------------------------------------------------------------

  /**
   * Description   Supprime une réservation selon son identifiant unique.
   *
   * @version      1.0.0
   * @example      reservation_tapi.delete_reservation(3);
   * @author       Tristan Tanguay
   * @created      2026-03-16
   * @param        p_id_reservation   Identifiant de la réservation à supprimer.
   */
   procedure delete_reservation (
      p_id_reservation in reservation.id_reservation%type
   ) is
   begin
      delete from reservation
       where id_reservation = p_id_reservation;

      if sql%rowcount = 0 then
         logger.log_warning(
            'reservation_tapi.delete_reservation',
            'Aucune réservation à supprimer pour id=' || p_id_reservation
         );
         raise_application_error(
            -20022,
            'Aucune réservation trouvée pour id=' || p_id_reservation
         );
      else
         commit;
         logger.log_information(
            'reservation_tapi.delete_reservation',
            'Réservation supprimée ID=' || p_id_reservation
         );
         dbms_output.put_line('Réservation supprimée ID=' || p_id_reservation);
      end if;

   exception
      when others then
         if sqlcode = -2292 then
            logger.log_error(
               'reservation_tapi.delete_reservation',
               'Violation de contrainte FK pour id=' || p_id_reservation
            );
            raise_application_error(
               -20023,
               'Impossible de supprimer : cette réservation est référencée par d''autres données.'
            );
         else
            logger.log_error(
               'reservation_tapi.delete_reservation',
               'Erreur SQL: ' || sqlerrm
            );
            rollback;
            raise;
         end if;
   end delete_reservation;


end reservation_tapi;