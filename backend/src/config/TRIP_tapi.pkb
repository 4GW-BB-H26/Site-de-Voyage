create or replace package body trip_tapi as

  /**
   * Description   Récupère les informations d'un voyage à partir de son identifiant.
   *
   * @version      1.0.0
   * @example      trip_tapi.select_trip(1);
   * @author       Tristan Tanguay
   * @created      2026-03-17
   * @param        p_id_trip   Identifiant unique du voyage à récupérer.
   */
   procedure select_trip (
      p_id_trip in trip.id_trip%type
   ) is
      rec_t trip%rowtype;
   begin
      select *
        into rec_t
        from trip
       where id_trip = p_id_trip;

      logger.log_information(
         'trip_tapi.select_trip',
         'Voyage trouvé ID='
         || rec_t.id_trip
         || ', depart='
         || rec_t.depart_date
         || ', retour='
         || rec_t.return_date
      );

      dbms_output.put_line('Voyage '
                           || rec_t.id_trip
                           || ': '
                           || rec_t.depart_date
                           || ' - ' || rec_t.return_date);

   exception
      when no_data_found then
         logger.log_warning(
            'trip_tapi.select_trip',
            'Aucun voyage trouvé pour id=' || p_id_trip
         );
         dbms_output.put_line('Aucun voyage trouvé pour id=' || p_id_trip);
      when others then
         logger.log_error(
            'trip_tapi.select_trip',
            'Erreur SQL: ' || sqlerrm
         );
         raise;
   end select_trip;
----------------------------------------------------------------------------------------------------------------------------

  /**
   * Description   Crée un nouveau voyage dans la base de données.
   *
   * @version      1.0.0
   * @example      trip_tapi.insert_trip(1, SYSTIMESTAMP, SYSTIMESTAMP+7, 1);
   * @author       Tristan Tanguay
   * @created      2026-03-17
   * @param        p_id_trip            Identifiant du voyage à créer.
   * @param        p_depart_date        Date et heure de départ.
   * @param        p_return_date        Date et heure de retour.
   * @param        p_package_id_package Identifiant du paquet associé.
   */
   procedure insert_trip (
      p_id_trip            in trip.id_trip%type,
      p_depart_date        in trip.depart_date%type,
      p_return_date        in trip.return_date%type,
      p_package_id_package in trip.package_id_package%type
   ) is
   begin
      insert into trip (
         id_trip,
         depart_date,
         return_date,
         package_id_package
      ) values ( p_id_trip,
                 p_depart_date,
                 p_return_date,
                 p_package_id_package );

      commit;
      logger.log_information(
         'trip_tapi.insert_trip',
         'Voyage créé avec succès : ID=' || p_id_trip
      );
      dbms_output.put_line('Voyage créé ID=' || p_id_trip);
   exception
      when dup_val_on_index then
         logger.log_warning(
            'trip_tapi.insert_trip',
            'Voyage déjà existant ID=' || p_id_trip
         );
         raise_application_error(
            -20020,
            'Voyage déjà existant: ' || p_id_trip
         );
      when value_error then
         logger.log_error(
            'trip_tapi.insert_trip',
            'Erreur de type de valeur : ' || sqlerrm
         );
         raise;
      when others then
         logger.log_error(
            'trip_tapi.insert_trip',
            'Erreur SQL: ' || sqlerrm
         );
         rollback;
         raise;
   end insert_trip;
----------------------------------------------------------------------------------------------------------------------------

  /**
   * Description   Met à jour les informations d'un voyage existant.
   *
   * @version      1.0.0
   * @example      trip_tapi.update_trip(1, SYSTIMESTAMP+10, SYSTIMESTAMP+17, 2);
   * @author       Tristan Tanguay
   * @created      2026-03-17
   * @param        p_id_trip         Identifiant du voyage à modifier.
   * @param        p_new_depart_date Nouvelle date de départ.
   * @param        p_new_return_date Nouvelle date de retour.
   * @param        p_new_package_id  Nouvel identifiant du paquet associé.
   */
   procedure update_trip (
      p_id_trip         in trip.id_trip%type,
      p_new_depart_date in trip.depart_date%type,
      p_new_return_date in trip.return_date%type,
      p_new_package_id  in trip.package_id_package%type
   ) is
   begin
      update trip
         set depart_date = p_new_depart_date,
             return_date = p_new_return_date,
             package_id_package = p_new_package_id
       where id_trip = p_id_trip;

      if sql%rowcount = 0 then
         logger.log_warning(
            'trip_tapi.update_trip',
            'Aucun enregistrement trouvé pour id=' || p_id_trip
         );
         raise_application_error(
            -20021,
            'Aucun voyage trouvé pour id=' || p_id_trip
         );
      else
         commit;
         logger.log_information(
            'trip_tapi.update_trip',
            'Voyage mis à jour avec succès ID=' || p_id_trip
         );
         dbms_output.put_line('Voyage mis à jour ID=' || p_id_trip);
      end if;

   exception
      when others then
         logger.log_error(
            'trip_tapi.update_trip',
            'Erreur SQL: ' || sqlerrm
         );
         rollback;
         raise;
   end update_trip;
----------------------------------------------------------------------------------------------------------------------------

  /**
   * Description   Supprime un voyage selon son identifiant unique.
   *
   * @version      1.0.0
   * @example      trip_tapi.delete_trip;
   * @author       Tristan Tanguay
   * @created      2026-03-17
   * @param        p_id_trip   Identifiant du voyage à supprimer.
   */
   procedure delete_trip (
      p_id_trip in trip.id_trip%type
   ) is
   begin
      delete from trip
       where id_trip = p_id_trip;

      if sql%rowcount = 0 then
         logger.log_warning(
            'trip_tapi.delete_trip',
            'Aucun voyage à supprimer pour id=' || p_id_trip
         );
         raise_application_error(
            -20022,
            'Aucun voyage trouvé pour id=' || p_id_trip
         );
      else
         commit;
         logger.log_information(
            'trip_tapi.delete_trip',
            'Voyage supprimé ID=' || p_id_trip
         );
         dbms_output.put_line('Voyage supprimé ID=' || p_id_trip);
      end if;

   exception
      when others then
         if sqlcode = -2292 then
            logger.log_error(
               'trip_tapi.delete_trip',
               'Violation de contrainte FK pour id=' || p_id_trip
            );
            raise_application_error(
               -20023,
               'Impossible de supprimer : ce voyage est référencé par d''autres données.'
            );
         else
            logger.log_error(
               'trip_tapi.delete_trip',
               'Erreur SQL: ' || sqlerrm
            );
            rollback;
            raise;
         end if;
   end delete_trip;


end trip_tapi;