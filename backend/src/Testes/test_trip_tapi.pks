create or replace package test_trip_tapi is
  --%suite(test_trip_tapi)
  --%suitepath(alltests)
  --%rollback(auto)

  --%test
   procedure test_select_trip;

  --%test
   procedure test_select_trip_not_found;

  --%test
   procedure test_insert_trip;

  --%test
   procedure test_insert_duplicate_trip;

  --%test
   procedure test_update_trip;

  --%test
   procedure test_update_trip_not_found;

  --%test
   procedure test_delete_trip;

  --%test
   procedure test_delete_trip_not_found;

end test_trip_tapi;