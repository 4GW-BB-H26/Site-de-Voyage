CREATE OR REPLACE PACKAGE BODY test_package_tapi AS
   mode_test VARCHAR2(1) := 'O';
   objet_json VARCHAR2(4000);

   /**
    *
    * Cette procedure permet de creer un package - test positif
    */
   PROCEDURE ins_package_nominal AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_id_destination destination.id_destination%TYPE;
   BEGIN
      -- arrange
      -- Selectionner une destination existante pour l'insertion
      SELECT id_destination
        INTO l_id_destination
        FROM destination
       FETCH FIRST 1 ROW ONLY;
      -- act
      -- Insertion des donnees dans la table PACKAGE
      objet_json := package_tapi.ins_package(
         p_hotel_name => 'Hotel Test',p_excursion => 'Excursion Test',p_transport_type => 'Avion',p_guide_name => 'Guide Test'
         ,p_length => 7,p_global_rating => 4.5,p_nb_ratings => 100,p_description => 'Description test',p_price => 999.99,p_destination_id_destination => l_id_destination
         ,p_id_destination => l_id_destination,p_test => mode_test
      );
      -- Retourner un JSON en assignant la valeur de $.data.id a l_id_package
      l_id_package := JSON_VALUE(objet_json,'$.data.id');
      -- assert
      dbms_output.put_line('objet_json ' || objet_json);
      dbms_output.put_line('id_package ' || l_id_package);
      ut.expect(l_id_package).to_be_not_null;
      ROLLBACK;
   END ins_package_nominal;

   /**
    *
    * Cette procedure permet de creer un package - test negatif (donnees manquantes)
    */
   PROCEDURE ins_package_avec_manquant AS
      l_status_code VARCHAR2(20);
      l_id_destination destination.id_destination%TYPE;
   BEGIN
      -- arrange
      SELECT id_destination
        INTO l_id_destination
        FROM destination
       FETCH FIRST 1 ROW ONLY;
      -- act
      objet_json := package_tapi.ins_package(
         p_hotel_name => NULL,p_excursion => 'Excursion',p_transport_type => 'Avion',p_guide_name => 'Guide',p_length => 7,p_global_rating => 4
         ,p_nb_ratings => 10,p_description => 'Desc',p_price => 500,p_destination_id_destination => l_id_destination,p_id_destination => l_id_destination
         ,p_test => mode_test
      );
      -- assert
      l_status_code := nvl(
         JSON_VALUE(objet_json,'$.errors[0].code'),'1'
      );
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('-1400');
      ROLLBACK;
   END ins_package_avec_manquant;

   /**
    *
    * Cette procedure permet de creer un package - test negatif (prix negatif)
    */
   PROCEDURE ins_package_prix_negatif AS
      l_status_code VARCHAR2(20);
      l_id_destination destination.id_destination%TYPE;
   BEGIN
      -- arrange
      SELECT id_destination
        INTO l_id_destination
        FROM destination
       FETCH FIRST 1 ROW ONLY;
      -- act
      objet_json := package_tapi.ins_package(
         p_hotel_name => 'Hotel',p_excursion => 'Excursion',p_transport_type => 'Avion',p_guide_name => 'Guide',p_length => 7
         ,p_global_rating => 4,p_nb_ratings => 10,p_description => 'Desc',p_price => - 100,p_destination_id_destination => l_id_destination
         ,p_id_destination => l_id_destination,p_test => mode_test
      );
      -- assert
      l_status_code := nvl(
         JSON_VALUE(objet_json,'$.errors[0].code'),'1'
      );
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('-20002');
      ROLLBACK;
   END ins_package_prix_negatif;

   /**
    *
    * Cette procedure permet de supprimer un package - test positif
    */
   PROCEDURE del_package AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_status_code VARCHAR2(4000);
   BEGIN
      -- arrange
      SELECT id_package
        INTO l_id_package
        FROM "PACKAGE"
       FETCH FIRST 1 ROW ONLY;
      -- act
      objet_json := package_tapi.del_package(
         l_id_package,mode_test
      );
      l_status_code := JSON_VALUE(objet_json,'$.meta.statusCode');
      -- assert
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code ' || l_status_code);
      ut.expect(l_status_code).to_equal('200');
      ROLLBACK;
   END del_package;

   /**
    *
    * Cette procedure permet de supprimer un package - test negatif
    */
   PROCEDURE del_package_inexistant AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_status_code VARCHAR2(20);
   BEGIN
      -- arrange
      l_id_package := NULL;
      -- act
      objet_json := package_tapi.del_package(
         l_id_package,mode_test
      );
      l_status_code := JSON_VALUE(objet_json,'$.errors[0].code');
      -- assert
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('100');
      ROLLBACK;
   END del_package_inexistant;

   /**
    *
    * Cette procedure permet de supprimer un package inexistant (id invalide) - test negatif
    */
   PROCEDURE del_package_id_null AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_status_code VARCHAR2(20);
   BEGIN
      -- arrange
      l_id_package := NULL;
      -- act
      objet_json := package_tapi.del_package(
         l_id_package,mode_test
      );
      l_status_code := JSON_VALUE(objet_json,'$.errors[0].code');
      -- assert
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('100');
      ROLLBACK;
   END del_package_id_null;

   /**
    *
    * Cette procedure permet de recuperer un package - test positif
    */
   PROCEDURE get_package IS
      l_expected "PACKAGE".id_package%TYPE;
      l_id_package "PACKAGE".id_package%TYPE;
      l_id_json VARCHAR2(4000);
   BEGIN
      -- arrange
      SELECT id_package
        INTO l_id_package
        FROM "PACKAGE"
       FETCH FIRST 1 ROW ONLY;
      -- act
      objet_json := package_tapi.get_package(l_id_package);
      l_id_json := JSON_VALUE(objet_json,'$.data.id');
      -- assert
      dbms_output.put_line('json obj: ' || objet_json);
      dbms_output.put_line('l_id_package ' || l_id_package);
      l_expected := l_id_package;
      ut.expect(l_id_json).to_equal(to_char(l_expected));
      ROLLBACK;
   END get_package;

   /**
    *
    * Cette procedure permet de recuperer un package - test negatif (package inexistant)
    */
   PROCEDURE get_package_inexistant AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_error_code VARCHAR2(20);
   BEGIN
      -- arrange
      l_id_package := 999999999;
      -- act
      objet_json := package_tapi.get_package(l_id_package);
      -- assert
      l_error_code := JSON_VALUE(objet_json,'$.errors[0].code');
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_id_package ' || l_id_package);
      ut.expect(l_error_code).to_equal('100');
      ROLLBACK;
   END get_package_inexistant;

   /**
    *
    * Cette procedure permet de modifier un package - test positif
    */
   PROCEDURE upd_package AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_prix_incrementation "PACKAGE".price%TYPE;
      l_prix_ancien "PACKAGE".price%TYPE;
      l_nouveau_prix NUMBER;
   BEGIN
      -- arrange
      SELECT id_package,price
        INTO
         l_id_package,l_prix_ancien
        FROM "PACKAGE"
       FETCH FIRST 1 ROW ONLY;
      l_prix_incrementation := 100;
      -- act
      objet_json := package_tapi.upd_package(
         p_id_package => l_id_package,p_price => l_prix_ancien + l_prix_incrementation,p_test => mode_test
      );
      l_nouveau_prix := TO_NUMBER ( JSON_VALUE(objet_json,'$.data.attributes.price') );
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_id_package ' || l_id_package);
      -- assert
      ut.expect(l_nouveau_prix).to_equal(l_prix_ancien + l_prix_incrementation);
      ROLLBACK;
   END upd_package;

   /**
    *
    * Cette procedure permet de modifier un package - test negatif (prix negatif)
    */
   PROCEDURE upd_package_prix_negatif AS
      l_id_package "PACKAGE".id_package%TYPE;
      l_status_code VARCHAR2(20);
   BEGIN
      -- arrange
      SELECT id_package
        INTO l_id_package
        FROM "PACKAGE"
       FETCH FIRST 1 ROW ONLY;
      -- act
      objet_json := package_tapi.upd_package(
         p_id_package => l_id_package,p_price => - 50,p_test => mode_test
      );
      -- assert
      l_status_code := JSON_VALUE(objet_json,'$.errors[0].code');
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('-20002');
      ROLLBACK;
   END upd_package_prix_negatif;

   /**
    *
    * Cette procedure permet de modifier un package - test negatif (package inexistant)
    */
   PROCEDURE upd_package_inexistant AS
      l_status_code VARCHAR2(20);
   BEGIN
      -- arrange
      -- act
      objet_json := package_tapi.upd_package(
         p_id_package => 999999999,p_hotel_name => 'Hotel Fantome',p_test => mode_test
      );
      -- assert
      l_status_code := JSON_VALUE(objet_json,'$.errors[0].code');
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('100');
      ROLLBACK;
   END upd_package_inexistant;

END test_package_tapi;
/
SHOW ERRORS;