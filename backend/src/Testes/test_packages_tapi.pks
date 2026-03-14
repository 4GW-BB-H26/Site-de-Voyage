create or replace package test_package_tapi as

   --%suite(test_package_tapi)
   --%suitepath(tous_les_tests)
   --%rollback(manual)

   --%test (tester normalement insertion package et verifier si le package a ete insere)
   procedure ins_package_nominal;

   --%test (verifier la creation avec donnees manquantes)
   procedure ins_package_avec_manquant;

   --%test (insertion avec prix negatif)
   procedure ins_package_prix_negatif;

   --%test (delete un package cree)
   procedure del_package;

   --%test (delete un package inexistant)
   procedure del_package_inexistant;

   --%test (delete un package avec id null)
   procedure del_package_id_null;

   --%test (get package)
   procedure get_package;

   --%test (get package inexistant)
   procedure get_package_inexistant;

   --%test (update package)
   procedure upd_package;

   --%test (update package avec prix negatif)
   procedure upd_package_prix_negatif;

   --%test (update package inexistant)
   procedure upd_package_inexistant;

end test_package_tapi;
/
SHOW ERRORS;
