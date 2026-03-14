CREATE OR REPLACE PACKAGE BODY package_tapi AS

   gc_scope_prefix CONSTANT VARCHAR2(31) := lower($$plsql_unit)
                                            || '.';

   FUNCTION router_erreur (
      p_code_erreur NUMBER
   ) RETURN VARCHAR2 IS
      l_status VARCHAR2(10);
      l_titre VARCHAR2(4000);
      l_details VARCHAR2(4000);
      l_code NUMBER := p_code_erreur;
      l_reponse VARCHAR2(4000);
   BEGIN
      CASE p_code_erreur
         WHEN 100 THEN
            l_status := '404';
            l_titre := 'Package introuvable';
            l_details := 'Aucune ligne correspondante';
         WHEN -20001 THEN
            l_status := '404';
            l_titre := 'Destination invalide';
            l_details := 'La destination referencee est invalide';
         WHEN -20002 THEN
            l_status := '409';
            l_titre := 'Prix negatif';
            l_details := 'Le prix du package ne peut pas etre negatif';
         WHEN -20003 THEN
            l_status := '404';
            l_titre := 'Package introuvable';
            l_details := 'Le package demande est introuvable';
         WHEN -1400 THEN
            l_status := '400';
            l_titre := 'Valeur manquante';
            l_details := 'Vous avez oublie de saisir une valeur obligatoire';
         WHEN -2291 THEN
            l_status := '404';
            l_titre := 'Destination introuvable';
            l_details := 'La destination référence est invalide';
         ELSE
            l_status := '400';
            l_titre := 'Erreur systeme';
            l_details := 'Erreur inconnue';
      END CASE;
      l_reponse :=
         JSON_OBJECT('errors' VALUE JSON_ARRAY(
            JSON_OBJECT('status' VALUE l_status,'title' VALUE l_titre,'detail' VALUE l_details,'code' VALUE to_char(l_code),'meta'
            VALUE
               JSON_OBJECT('timestamp' VALUE to_char(
                  sysdate,'YYYY-MM-DD"T"HH24:MI:SS'
               ))
            )
         ));
      RETURN l_reponse;
   END router_erreur;


   FUNCTION router_succes (
      p_action VARCHAR2,p_id_package NUMBER
   ) RETURN VARCHAR2 IS
      l_scope logger_logs.scope%TYPE := gc_scope_prefix || 'router_succes';
      l_params logger.tab_param;
      l_code NUMBER;
      l_reponse VARCHAR2(4000);
      r_pkg package_tapi_rec;
   BEGIN
      logger.append_param(
         l_params,'action',p_action
      );
      logger.append_param(
         l_params,'id_package',p_id_package
      );
      logger.log(
         '>>>DEBUT',l_scope,NULL,l_params
      );
      CASE
         WHEN p_action = 'insert' THEN
            l_code := 201;
         ELSE
            l_code := 200;
      END CASE;

      IF p_action = 'delete' THEN
         l_reponse :=
            JSON_OBJECT('meta' VALUE
               JSON_OBJECT('status' VALUE 'success','statusCode' VALUE l_code)
            );
      ELSE
         SELECT id_package,hotel_name,excursion,transport_type,guide_name,length,global_rating,nb_ratings,description,price,destination_id_destination
         ,id_destination
           INTO
            r_pkg.id_package,r_pkg.hotel_name,r_pkg.excursion,r_pkg.transport_type,r_pkg.guide_name,r_pkg.length,r_pkg.global_rating
            ,r_pkg.nb_ratings,r_pkg.description,r_pkg.price,r_pkg.destination_id_destination,r_pkg.id_destination
           FROM "PACKAGE"
          WHERE id_package = p_id_package;

         l_reponse :=
            JSON_OBJECT('data' VALUE
               JSON_OBJECT('type' VALUE 'package','id' VALUE r_pkg.id_package,'attributes' VALUE
                  JSON_OBJECT('hotel_name' VALUE r_pkg.hotel_name,'excursion' VALUE r_pkg.excursion,'transport_type' VALUE r_pkg.transport_type
                  ,'guide_name' VALUE r_pkg.guide_name,'length' VALUE r_pkg.length,'global_rating' VALUE r_pkg.global_rating,
                  'nb_ratings' VALUE r_pkg.nb_ratings,'description' VALUE r_pkg.description,'price' VALUE r_pkg.price,'destination_id_destination'
                  VALUE r_pkg.destination_id_destination,'id_destination' VALUE r_pkg.id_destination)
               ),'meta' VALUE
               JSON_OBJECT('status' VALUE 'success','statusCode' VALUE l_code)
            );
      END IF;

      logger.append_param(
         l_params,'l_code',l_code
      );
      logger.log(
         '>>>FIN',l_scope,NULL,l_params
      );
      RETURN l_reponse;
   END router_succes;


   FUNCTION ins_package (
      p_hotel_name VARCHAR2,p_excursion VARCHAR2,p_transport_type VARCHAR2,p_guide_name VARCHAR2,p_length NUMBER,p_global_rating
      NUMBER,p_nb_ratings NUMBER,p_description VARCHAR2,p_price NUMBER,p_destination_id_destination NUMBER,p_id_destination NUMBER
      ,p_test VARCHAR2 DEFAULT 'N'
   ) RETURN VARCHAR2 IS
      l_scope logger_logs.scope%TYPE := gc_scope_prefix || 'ins_package';
      l_params logger.tab_param;
      l_id NUMBER;
      l_reponse VARCHAR2(4000);
   BEGIN
      logger.append_param(
         l_params,'hotel_name',p_hotel_name
      );
      logger.append_param(
         l_params,'excursion',p_excursion
      );
      logger.append_param(
         l_params,'transport_type',p_transport_type
      );
      logger.append_param(
         l_params,'guide_name',p_guide_name
      );
      logger.append_param(
         l_params,'length',p_length
      );
      logger.append_param(
         l_params,'global_rating',p_global_rating
      );
      logger.append_param(
         l_params,'nb_ratings',p_nb_ratings
      );
      logger.append_param(
         l_params,'description',p_description
      );
      logger.append_param(
         l_params,'price',p_price
      );
      logger.append_param(
         l_params,'destination_id_destination',p_destination_id_destination
      );
      logger.append_param(
         l_params,'id_destination',p_id_destination
      );
      logger.append_param(
         l_params,'test',p_test
      );
      logger.log(
         '>>>DEBUT',l_scope,NULL,l_params
      );
      IF p_price < 0 THEN
         RAISE exception_prix_negatif;
      END IF;
      INSERT INTO "PACKAGE" (
         id_package,hotel_name,excursion,transport_type,guide_name,length,global_rating,nb_ratings,description,price,destination_id_destination
         ,id_destination
      ) VALUES ( (
         SELECT nvl(
            max(id_package),0
         ) + 1
           FROM "PACKAGE"
      ),p_hotel_name,p_excursion,p_transport_type,p_guide_name,p_length,p_global_rating,p_nb_ratings,p_description,p_price,p_destination_id_destination
      ,p_id_destination ) RETURNING id_package INTO l_id;

      IF upper(p_test) = 'N' THEN
         COMMIT;
      END IF;
      logger.append_param(
         l_params,'id_package',l_id
      );
      logger.log(
         '>>>FIN',l_scope,NULL,l_params
      );
      RETURN router_succes(
         'insert',l_id
      );
   EXCEPTION
      WHEN OTHERS THEN
         ROLLBACK;
         logger.log_error(
            'ERR '
            || sqlcode
            || ' '
            || sqlerrm,l_scope,NULL,l_params
         );
         RETURN router_erreur(sqlcode);
   END ins_package;


   FUNCTION upd_package (
      p_id_package NUMBER,p_hotel_name VARCHAR2 DEFAULT NULL,p_excursion VARCHAR2 DEFAULT NULL,p_transport_type VARCHAR2 DEFAULT
      NULL,p_guide_name VARCHAR2 DEFAULT NULL,p_length NUMBER DEFAULT NULL,p_global_rating NUMBER DEFAULT NULL,p_nb_ratings NUMBER
      DEFAULT NULL,p_description VARCHAR2 DEFAULT NULL,p_price NUMBER DEFAULT NULL,p_destination_id_destination NUMBER DEFAULT
      NULL,p_id_destination NUMBER DEFAULT NULL,p_test VARCHAR2 DEFAULT 'N'
   ) RETURN VARCHAR2 IS
      l_scope logger_logs.scope%TYPE := gc_scope_prefix || 'upd_package';
      l_params logger.tab_param;
      r_pkg package_tapi_rec;
      l_reponse VARCHAR2(4000);
   BEGIN
      logger.append_param(
         l_params,'id_package',p_id_package
      );
      logger.append_param(
         l_params,'hotel_name',p_hotel_name
      );
      logger.append_param(
         l_params,'excursion',p_excursion
      );
      logger.append_param(
         l_params,'transport_type',p_transport_type
      );
      logger.append_param(
         l_params,'guide_name',p_guide_name
      );
      logger.append_param(
         l_params,'length',p_length
      );
      logger.append_param(
         l_params,'global_rating',p_global_rating
      );
      logger.append_param(
         l_params,'nb_ratings',p_nb_ratings
      );
      logger.append_param(
         l_params,'description',p_description
      );
      logger.append_param(
         l_params,'price',p_price
      );
      logger.append_param(
         l_params,'destination_id_destination',p_destination_id_destination
      );
      logger.append_param(
         l_params,'id_destination',p_id_destination
      );
      logger.append_param(
         l_params,'test',p_test
      );
      logger.log(
         '>>>DEBUT',l_scope,NULL,l_params
      );
      UPDATE "PACKAGE"
         SET hotel_name = coalesce(
         p_hotel_name,hotel_name
      ),excursion = coalesce(
                p_excursion,excursion
             ),transport_type = coalesce(
                p_transport_type,transport_type
             ),guide_name = coalesce(
                p_guide_name,guide_name
             ),length = coalesce(
                p_length,length
             ),global_rating = coalesce(
                p_global_rating,global_rating
             ),nb_ratings = coalesce(
                p_nb_ratings,nb_ratings
             ),description = coalesce(
                p_description,description
             ),price = coalesce(
                p_price,price
             ),destination_id_destination = coalesce(
                p_destination_id_destination,destination_id_destination
             ),id_destination = coalesce(
                p_id_destination,id_destination
             )
       WHERE id_package = p_id_package RETURNING id_package,hotel_name,excursion,transport_type,guide_name,length,global_rating
       ,nb_ratings,description,price,destination_id_destination,id_destination INTO r_pkg.id_package,r_pkg.hotel_name,r_pkg.excursion
       ,r_pkg.transport_type,r_pkg.guide_name,r_pkg.length,r_pkg.global_rating,r_pkg.nb_ratings,r_pkg.description,r_pkg.price
       ,r_pkg.destination_id_destination,r_pkg.id_destination;

      IF SQL%rowcount = 0 THEN
         RAISE no_data_found;
      END IF;
      IF r_pkg.price < 0 THEN
         RAISE exception_prix_negatif;
      END IF;
      IF upper(p_test) = 'N' THEN
         COMMIT;
      END IF;
      logger.append_param(
         l_params,'id_package',r_pkg.id_package
      );
      logger.log(
         '>>>FIN',l_scope,NULL,l_params
      );
      RETURN router_succes(
         'update',r_pkg.id_package
      );
   EXCEPTION
      WHEN OTHERS THEN
         ROLLBACK;
         logger.log_error(
            'ERR '
            || sqlcode
            || ' '
            || sqlerrm,l_scope,NULL,l_params
         );
         RETURN router_erreur(sqlcode);
   END upd_package;


   FUNCTION del_package (
      p_id_package NUMBER,p_test VARCHAR2 DEFAULT 'N'
   ) RETURN VARCHAR2 IS
      l_scope logger_logs.scope%TYPE := gc_scope_prefix || 'del_package';
      l_params logger.tab_param;
      r_pkg package_tapi_rec;
      l_reponse VARCHAR2(4000);
   BEGIN
      logger.append_param(
         l_params,'id_package',p_id_package
      );
      logger.append_param(
         l_params,'test',p_test
      );
      logger.log(
         '>>>DEBUT',l_scope,NULL,l_params
      );
      IF p_id_package IS NULL THEN
         RAISE no_data_found;
      END IF;
      DELETE FROM "PACKAGE"
       WHERE id_package = p_id_package RETURNING id_package,hotel_name,excursion,transport_type,guide_name,length,global_rating
       ,nb_ratings,description,price,destination_id_destination,id_destination INTO r_pkg.id_package,r_pkg.hotel_name,r_pkg.excursion
       ,r_pkg.transport_type,r_pkg.guide_name,r_pkg.length,r_pkg.global_rating,r_pkg.nb_ratings,r_pkg.description,r_pkg.price
       ,r_pkg.destination_id_destination,r_pkg.id_destination;

      IF SQL%rowcount = 0 THEN
         RAISE no_data_found;
      END IF;
      IF upper(p_test) = 'N' THEN
         COMMIT;
      END IF;
      logger.append_param(
         l_params,'id_package',r_pkg.id_package
      );
      logger.log(
         '>>>FIN',l_scope,NULL,l_params
      );
      l_reponse := router_succes(
         'delete',r_pkg.id_package
      );
      RETURN l_reponse;
   EXCEPTION
      WHEN OTHERS THEN
         ROLLBACK;
         logger.log_error(
            'ERR '
            || sqlcode
            || ' '
            || sqlerrm,l_scope,NULL,l_params
         );
         RETURN router_erreur(sqlcode);
   END del_package;


   FUNCTION get_package (
      p_id_package NUMBER
   ) RETURN VARCHAR2 IS
      l_scope logger_logs.scope%TYPE := gc_scope_prefix || 'get_package';
      l_params logger.tab_param;
      l_reponse VARCHAR2(4000);
   BEGIN
      logger.append_param(
         l_params,'id_package',p_id_package
      );
      logger.log(
         '>>>DEBUT',l_scope,NULL,l_params
      );
      l_reponse := router_succes(
         'get',p_id_package
      );
      logger.log(
         '>>>FIN',l_scope,NULL,l_params
      );
      RETURN l_reponse;
   EXCEPTION
      WHEN OTHERS THEN
         RETURN router_erreur(sqlcode);
   END get_package;

END package_tapi;
/
SHOW ERRORS;