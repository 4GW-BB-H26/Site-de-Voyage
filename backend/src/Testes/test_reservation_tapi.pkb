create or replace package body test_reservation_tapi is

   procedure test_select_reservation is
      l_id          number;
      l_status_code number;
   begin
      select nvl(
         min(id_reservation),
         0
      )
        into l_id
        from reservation;
      if l_id = 0 then
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
         ) values ( 1,
                    100001,
                    sysdate,
                    sysdate + 10,
                    sysdate + 17,
                    2,
                    1850,
                    'À venir',
                    1,
                    1,
                    1 );
         commit;
         l_id := 1;
      end if;

      l_status_code := 0;
      begin
         reservation_tapi.select_reservation(l_id);
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_select_reservation;

   procedure test_select_reservation_not_found is
      l_status_code number;
   begin
      l_status_code := 0;
      begin
         reservation_tapi.select_reservation(999999);
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(-20022);
   end test_select_reservation_not_found;

   procedure test_insert_reservation is
      l_id          number;
      l_user        number;
      l_trip        number;
      l_status_code number;
   begin
      select nvl(
         max(id_reservation),
         0
      ) + 1
        into l_id
        from reservation;
      select nvl(
         max(users_id_users),
         0
      ) + 1
        into l_user
        from reservation;
      select nvl(
         max(trip_id_trip),
         0
      ) + 1
        into l_trip
        from reservation;

      l_status_code := 0;
      begin
         reservation_tapi.insert_reservation(
            l_id,
            100000 + l_id,
            sysdate,
            sysdate + 5,
            sysdate + 12,
            2,
            1500,
            'À venir',
            l_user,
            l_trip,
            l_trip
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_insert_reservation;

   procedure test_insert_duplicate_reservation is
      l_id          number;
      l_user        number;
      l_trip        number;
      l_status_code number;
   begin
      select nvl(
         max(id_reservation),
         0
      )
        into l_id
        from reservation;
      select nvl(
         max(users_id_users),
         0
      )
        into l_user
        from reservation;
      select nvl(
         max(trip_id_trip),
         0
      )
        into l_trip
        from reservation;

      l_status_code := 0;
      begin
         reservation_tapi.insert_reservation(
            l_id,
            999999,
            sysdate,
            sysdate + 5,
            sysdate + 12,
            2,
            1500,
            'À venir',
            l_user,
            l_trip,
            l_trip
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(-20020);
   end test_insert_duplicate_reservation;

   procedure test_update_reservation is
      l_id          number;
      l_user        number;
      l_trip        number;
      l_status_code number;
   begin
      select nvl(
         max(id_reservation),
         0
      ) + 1
        into l_id
        from reservation;
      select nvl(
         max(users_id_users),
         0
      ) + 1
        into l_user
        from reservation;
      select nvl(
         max(trip_id_trip),
         0
      ) + 1
        into l_trip
        from reservation;

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
      ) values ( l_id,
                 100000 + l_id,
                 sysdate,
                 sysdate + 5,
                 sysdate + 12,
                 2,
                 1500,
                 'À venir',
                 l_user,
                 l_trip,
                 l_trip );
      commit;
      l_status_code := 0;
      begin
         reservation_tapi.update_reservation(
            l_id,
            sysdate + 10,
            sysdate + 17,
            3,
            2200,
            'Validée'
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_update_reservation;

   procedure test_update_reservation_not_found is
      l_status_code number;
   begin
      l_status_code := 0;
      begin
         reservation_tapi.update_reservation(
            999999,
            sysdate + 10,
            sysdate + 17,
            3,
            2200,
            'Validée'
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(-20021);
   end test_update_reservation_not_found;

   procedure test_delete_reservation is
      l_id          number;
      l_user        number;
      l_trip        number;
      l_status_code number;
   begin
      select nvl(
         max(id_reservation),
         0
      ) + 1
        into l_id
        from reservation;
      select nvl(
         max(users_id_users),
         0
      ) + 1
        into l_user
        from reservation;
      select nvl(
         max(trip_id_trip),
         0
      ) + 1
        into l_trip
        from reservation;

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
      ) values ( l_id,
                 100000 + l_id,
                 sysdate,
                 sysdate + 5,
                 sysdate + 12,
                 2,
                 1500,
                 'À venir',
                 l_user,
                 l_trip,
                 l_trip );
      commit;
      l_status_code := 0;
      begin
         reservation_tapi.delete_reservation(l_id);
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_delete_reservation;

   procedure test_delete_reservation_not_found is
      l_status_code number;
   begin
      l_status_code := 0;
      begin
         reservation_tapi.delete_reservation(999999);
         l_status_code := sqlcode;
      end;
      ut.expect(l_status_code).to_equal(-20022);
   end test_delete_reservation_not_found;

end test_reservation_tapi;