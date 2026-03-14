create or replace package body test_package_tapi as
   mode_test  varchar2(1) := 'O';
   objet_json varchar2(4000);

   /**
    *
    * Cette procedure permet de creer un package - test positif
    */
   procedure ins_package_nominal as
      l_id_package   "PACKAGE".id_package%type;
      l_id_destination destination.id_destination%type;
   begin
      -- arrange
      -- Selectionner une destination existante pour l'insertion
      select id_destination
        into l_id_destination
        from destination
       fetch first 1 row only;
      -- act
      -- Insertion des donnees dans la table PACKAGE
      objet_json := package_tapi.ins_package(
         p_hotel_name                 => 'Hotel Test',
         p_excursion                  => 'Excursion Test',
         p_transport_type             => 'Avion',
         p_guide_name                 => 'Guide Test',
         p_length                     => 7,
         p_global_rating              => 4.5,
         p_nb_ratings                 => 100,
         p_description                => 'Description test',
         p_price                      => 999.99,
         p_destination_id_destination => l_id_destination,
         p_id_destination             => l_id_destination,
         p_test                       => mode_test
      );
      -- Retourner un JSON en assignant la valeur de $.data.id a l_id_package
      l_id_package := json_value(objet_json, '$.data.id');
      -- assert
      dbms_output.put_line('objet_json ' || objet_json);
      dbms_output.put_line('id_package ' || l_id_package);
      ut.expect(l_id_package).to_be_not_null;
      rollback;
   end ins_package_nominal;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de creer un package - test negatif (donnees manquantes)
    */
   procedure ins_package_avec_manquant as
      l_status_code    varchar2(20);
      l_id_destination destination.id_destination%type;
   begin
      -- arrange
      select id_destination
        into l_id_destination
        from destination
       fetch first 1 row only;
      -- act
      objet_json := package_tapi.ins_package(
         p_hotel_name                 => null,
         p_excursion                  => 'Excursion',
         p_transport_type             => 'Avion',
         p_guide_name                 => 'Guide',
         p_length                     => 7,
         p_global_rating              => 4,
         p_nb_ratings                 => 10,
         p_description                => 'Desc',
         p_price                      => 500,
         p_destination_id_destination => l_id_destination,
         p_id_destination             => l_id_destination,
         p_test                       => mode_test
      );
      -- assert
      l_status_code := nvl(
         json_value(objet_json, '$.errors[0].code'),
         '1'
      );
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('-1400');
      rollback;
   end ins_package_avec_manquant;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de creer un package - test negatif (prix negatif)
    */
   procedure ins_package_prix_negatif as
      l_status_code    varchar2(20);
      l_id_destination destination.id_destination%type;
   begin
      -- arrange
      select id_destination
        into l_id_destination
        from destination
       fetch first 1 row only;
      -- act
      objet_json := package_tapi.ins_package(
         p_hotel_name                 => 'Hotel',
         p_excursion                  => 'Excursion',
         p_transport_type             => 'Avion',
         p_guide_name                 => 'Guide',
         p_length                     => 7,
         p_global_rating              => 4,
         p_nb_ratings                 => 10,
         p_description                => 'Desc',
         p_price                      => -100,
         p_destination_id_destination => l_id_destination,
         p_id_destination             => l_id_destination,
         p_test                       => mode_test
      );
      -- assert
      l_status_code := nvl(
         json_value(objet_json, '$.errors[0].code'),
         '1'
      );
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('-20002');
      rollback;
   end ins_package_prix_negatif;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de supprimer un package - test positif
    */
   procedure del_package as
      l_id_package   "PACKAGE".id_package%type;
      l_status_code  varchar2(4000);
   begin
      -- arrange
      select id_package
        into l_id_package
        from "PACKAGE"
       fetch first 1 row only;
      -- act
      objet_json := package_tapi.del_package(l_id_package, mode_test);
      l_status_code := json_value(objet_json, '$.meta.statusCode');
      -- assert
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code ' || l_status_code);
      ut.expect(l_status_code).to_equal('200');
      rollback;
   end del_package;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de supprimer un package - test negatif
    */
   procedure del_package_inexistant as
      l_id_package   "PACKAGE".id_package%type;
      l_status_code  varchar2(20);
   begin
      -- arrange
      l_id_package := null;
      -- act
      objet_json := package_tapi.del_package(l_id_package, mode_test);
      l_status_code := json_value(objet_json, '$.errors[0].code');
      -- assert
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('100');
      rollback;
   end del_package_inexistant;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de supprimer un package inexistant (id invalide) - test negatif
    */
   procedure del_package_id_null as
      l_id_package   "PACKAGE".id_package%type;
      l_status_code  varchar2(20);
   begin
      -- arrange
      l_id_package := null;
      -- act
      objet_json := package_tapi.del_package(l_id_package, mode_test);
      l_status_code := json_value(objet_json, '$.errors[0].code');
      -- assert
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('100');
      rollback;
   end del_package_id_null;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de recuperer un package - test positif
    */
   procedure get_package is
      l_expected    "PACKAGE".id_package%type;
      l_id_package  "PACKAGE".id_package%type;
      l_id_json     varchar2(4000);
   begin
      -- arrange
      select id_package
        into l_id_package
        from "PACKAGE"
       fetch first 1 row only;
      -- act
      objet_json := package_tapi.get_package(l_id_package);
      l_id_json := json_value(objet_json, '$.data.id');
      -- assert
      dbms_output.put_line('json obj: ' || objet_json);
      dbms_output.put_line('l_id_package ' || l_id_package);
      l_expected := l_id_package;
      ut.expect(l_id_json).to_equal(to_char(l_expected));
      rollback;
   end get_package;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de recuperer un package - test negatif (package inexistant)
    */
   procedure get_package_inexistant as
      l_id_package  "PACKAGE".id_package%type;
      l_error_code  varchar2(20);
   begin
      -- arrange
      l_id_package := 999999999;
      -- act
      objet_json := package_tapi.get_package(l_id_package);
      -- assert
      l_error_code := json_value(objet_json, '$.errors[0].code');
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_id_package ' || l_id_package);
      ut.expect(l_error_code).to_equal('100');
      rollback;
   end get_package_inexistant;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de modifier un package - test positif
    */
   procedure upd_package as
      l_id_package       "PACKAGE".id_package%type;
      l_prix_incrementation "PACKAGE".price%type;
      l_prix_ancien      "PACKAGE".price%type;
      l_nouveau_prix     number;
   begin
      -- arrange
      select id_package,
             price
        into l_id_package,
             l_prix_ancien
        from "PACKAGE"
       fetch first 1 row only;
      l_prix_incrementation := 100;
      -- act
      objet_json := package_tapi.upd_package(
         p_id_package => l_id_package,
         p_price      => l_prix_ancien + l_prix_incrementation,
         p_test       => mode_test
      );
      l_nouveau_prix := to_number(json_value(objet_json, '$.data.attributes.price'));
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_id_package ' || l_id_package);
      -- assert
      ut.expect(l_nouveau_prix).to_equal(l_prix_ancien + l_prix_incrementation);
      rollback;
   end upd_package;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de modifier un package - test negatif (prix negatif)
    */
   procedure upd_package_prix_negatif as
      l_id_package   "PACKAGE".id_package%type;
      l_status_code  varchar2(20);
   begin
      -- arrange
      select id_package
        into l_id_package
        from "PACKAGE"
       fetch first 1 row only;
      -- act
      objet_json := package_tapi.upd_package(
         p_id_package => l_id_package,
         p_price      => -50,
         p_test       => mode_test
      );
      -- assert
      l_status_code := json_value(objet_json, '$.errors[0].code');
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('-20002');
      rollback;
   end upd_package_prix_negatif;

   -- ----------------------------------------------------------------------------
   /**
    *
    * Cette procedure permet de modifier un package - test negatif (package inexistant)
    */
   procedure upd_package_inexistant as
      l_status_code varchar2(20);
   begin
      -- arrange
      -- act
      objet_json := package_tapi.upd_package(
         p_id_package => 999999999,
         p_hotel_name => 'Hotel Fantome',
         p_test       => mode_test
      );
      -- assert
      l_status_code := json_value(objet_json, '$.errors[0].code');
      dbms_output.put_line('objet json ' || objet_json);
      dbms_output.put_line('l_status_code: ' || l_status_code);
      ut.expect(l_status_code).to_equal('100');
      rollback;
   end upd_package_inexistant;

end test_package_tapi;
/
SHOW ERRORS;
