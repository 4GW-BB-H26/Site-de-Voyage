create or replace package test_reservation_tapi is
  --%suite(test_reservation_tapi)
  --%suitepath(alltests)
  --%rollback(auto)

  --%test
   procedure test_select_reservation;

  --%test
   procedure test_select_reservation_not_found;

  --%test
   procedure test_insert_reservation;

  --%test
   procedure test_insert_duplicate_reservation;

  --%test
   procedure test_update_reservation;

  --%test
   procedure test_update_reservation_not_found;

  --%test
   procedure test_delete_reservation;

  --%test
   procedure test_delete_reservation_not_found;

end test_reservation_tapi;