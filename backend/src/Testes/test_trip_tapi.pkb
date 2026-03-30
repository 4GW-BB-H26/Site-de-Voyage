create or replace package body test_trip_tapi is

   procedure test_select_trip is
      l_id          number;
      l_status_code number;
   begin
      select nvl(
         min(id_trip),
         0
      )
        into l_id
        from trip;
      if l_id = 0 then
         insert into trip (
            id_trip,
            depart_date,
            return_date,
            package_id_package
         ) values ( 1,
                    systimestamp,
                    systimestamp + 7,
                    1 );
         commit;
         l_id := 1;
      end if;

      l_status_code := 0;
      begin
         trip_tapi.select_trip(l_id);
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_select_trip;

   procedure test_select_trip_not_found is
      l_status_code number;
   begin
      l_status_code := 0;
      begin
         trip_tapi.select_trip(999999);
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(-20022);
   end test_select_trip_not_found;

   procedure test_insert_trip is
      l_id          number;
      l_package     number;
      l_status_code number;
   begin
      select nvl(
         max(id_trip),
         0
      ) + 1
        into l_id
        from trip;
      select nvl(
         max(package_id_package),
         0
      ) + 1
        into l_package
        from trip;

      l_status_code := 0;
      begin
         trip_tapi.insert_trip(
            l_id,
            systimestamp + 5,
            systimestamp + 12,
            l_package
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_insert_trip;

   procedure test_insert_duplicate_trip is
      l_id          number;
      l_package     number;
      l_status_code number;
   begin
      select nvl(
         max(id_trip),
         0
      )
        into l_id
        from trip;
      select nvl(
         max(package_id_package),
         0
      )
        into l_package
        from trip;

      l_status_code := 0;
      begin
         trip_tapi.insert_trip(
            l_id,
            systimestamp + 5,
            systimestamp + 12,
            l_package
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(-20020);
   end test_insert_duplicate_trip;

   procedure test_update_trip is
      l_id          number;
      l_package     number;
      l_status_code number;
   begin
      select nvl(
         max(id_trip),
         0
      ) + 1
        into l_id
        from trip;
      select nvl(
         max(package_id_package),
         0
      ) + 1
        into l_package
        from trip;

      insert into trip (
         id_trip,
         depart_date,
         return_date,
         package_id_package
      ) values ( l_id,
                 systimestamp + 5,
                 systimestamp + 12,
                 l_package );
      commit;
      l_status_code := 0;
      begin
         trip_tapi.update_trip(
            l_id,
            systimestamp + 10,
            systimestamp + 17,
            l_package
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_update_trip;

   procedure test_update_trip_not_found is
      l_status_code number;
   begin
      l_status_code := 0;
      begin
         trip_tapi.update_trip(
            999999,
            systimestamp + 10,
            systimestamp + 17,
            1
         );
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(-20021);
   end test_update_trip_not_found;

   procedure test_delete_trip is
      l_id          number;
      l_package     number;
      l_status_code number;
   begin
      select nvl(
         max(id_trip),
         0
      ) + 1
        into l_id
        from trip;
      select nvl(
         max(package_id_package),
         0
      ) + 1
        into l_package
        from trip;

      insert into trip (
         id_trip,
         depart_date,
         return_date,
         package_id_package
      ) values ( l_id,
                 systimestamp + 5,
                 systimestamp + 12,
                 l_package );
      commit;
      l_status_code := 0;
      begin
         trip_tapi.delete_trip(l_id);
         l_status_code := 1;
      exception
         when others then
            l_status_code := sqlcode;
      end;

      ut.expect(l_status_code).to_equal(1);
   end test_delete_trip;

   procedure test_delete_trip_not_found is
      l_status_code number;
   begin
      l_status_code := 0;
      begin
         trip_tapi.delete_trip(999999);
         l_status_code := sqlcode;
      end;
      ut.expect(l_status_code).to_equal(-20022);
   end test_delete_trip_not_found;

end test_trip_tapi;