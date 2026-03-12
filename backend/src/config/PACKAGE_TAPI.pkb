create or replace package body package_tapi as

   gc_scope_prefix constant varchar2(31) := lower($$plsql_unit)
                                            || '.';

--router des erreurs 
   function router_erreur (
      p_code_erreur number
   ) return varchar2 is
      l_status  varchar2(10);
      l_titre   varchar2(4000);
      l_details varchar2(4000);
      l_code    number := p_code_erreur;
      l_reponse varchar2(4000);
   begin
      case p_code_erreur
         when 100 then
            l_status := '404';
            l_titre := 'Package introuvable';
            l_details := 'Aucune ligne correspondante';
         when -20001 then
            l_status := '404';
            l_titre := 'Destination invalide';
            l_details := 'La destination referencee est invalide';
         when -20002 then
            l_status := '409';
            l_titre := 'Prix negatif';
            l_details := 'Le prix du package ne peut pas etre negatif';
         when -20003 then
            l_status := '404';
            l_titre := 'Package introuvable';
            l_details := 'Le package demande est introuvable';
         when -1400 then
            l_status := '400';
            l_titre := 'Valeur manquante';
            l_details := 'Vous avez oublie de saisir une valeur obligatoire';
         when -2291 then
            l_status := '404';
            l_titre := 'Destination introuvable';
            l_details := 'La destination référence est invalide';
         else
            l_status := '400';
            l_titre := 'Erreur systeme';
            l_details := 'Erreur inconnue';
      end case;
      l_reponse :=
         json_object(
            'errors' value json_array(
               json_object(
                  'status' value l_status,
                  'title' value l_titre,
                  'detail' value l_details,
                  'code' value to_char(l_code),
                  'meta' value
                     json_object(
                        'timestamp' value to_char(
                           sysdate,
                           'YYYY-MM-DD"T"HH24:MI:SS'
                        )
                     )
               )
            )
         );
      return l_reponse;
   end router_erreur;


--Router Success
   function router_succes (
      p_action    varchar2,
      p_id_package "PACKAGE".id_package%type
   ) return varchar2 is
      l_scope   logger_logs.scope%type := gc_scope_prefix || 'router_succes';
      l_params  logger.tab_param;
      l_code    number;
      l_reponse varchar2(4000);
      r_pkg     "PACKAGE"%rowtype;
   begin
      logger.append_param(l_params, 'action', p_action);
      logger.append_param(l_params, 'id_package', p_id_package);
      logger.log('>>>DEBUT', l_scope, null, l_params);

      case
         when p_action = 'insert' then
            l_code := 201;
         else
            l_code := 200;
      end case;

      if p_action = 'delete' then
         l_reponse :=
            json_object(
               'meta' value
                  json_object(
                     'status' value 'success',
                     'statusCode' value l_code
                  )
            );
      else
         select * into r_pkg from "PACKAGE" where id_package = p_id_package;

         l_reponse :=
            json_object(
               'data' value
                  json_object(
                     'type' value 'package',
                     'id' value r_pkg.id_package,
                     'attributes' value
                        json_object(
                           'hotel_name' value r_pkg.hotel_name,
                           'excursion' value r_pkg.excursion,
                           'transport_type' value r_pkg.transport_type,
                           'guide_name' value r_pkg.guide_name,
                           'length' value r_pkg.length,
                           'global_rating' value r_pkg.global_rating,
                           'nb_ratings' value r_pkg.nb_ratings,
                           'description' value r_pkg.description,
                           'price' value r_pkg.price,
                           'destination_id_destination' value r_pkg.destination_id_destination,
                           'id_destination' value r_pkg.id_destination
                        )
                  ),
               'meta' value
                  json_object(
                     'status' value 'success',
                     'statusCode' value l_code
                  )
            );
      end if;

      logger.log('>>>FIN', l_scope, null, l_params);
      return l_reponse;
   end router_succes;


--Insert
   function ins_package (
      p_hotel_name                 "PACKAGE".hotel_name%type,
      p_excursion                  "PACKAGE".excursion%type,
      p_transport_type             "PACKAGE".transport_type%type,
      p_guide_name                 "PACKAGE".guide_name%type,
      p_length                     "PACKAGE".length%type,
      p_global_rating              "PACKAGE".global_rating%type,
      p_nb_ratings                 "PACKAGE".nb_ratings%type,
      p_description                "PACKAGE".description%type,
      p_price                      "PACKAGE".price%type,
      p_destination_id_destination "PACKAGE".destination_id_destination%type,
      p_id_destination             "PACKAGE".id_destination%type,
      p_test                       varchar2 default 'N'
   ) return varchar2 is
      l_scope   logger_logs.scope%type := gc_scope_prefix || 'ins_package';
      l_params  logger.tab_param;
      l_id      "PACKAGE".id_package%type;
      l_reponse varchar2(4000);
   begin
      logger.append_param(l_params, 'hotel_name', p_hotel_name);
      logger.append_param(l_params, 'price', p_price);
      logger.append_param(l_params, 'test', p_test);
      logger.log('>>>DEBUT', l_scope, null, l_params);
      if p_price < 0 then
         raise exception_prix_negatif;
      end if;
      insert into "PACKAGE" (
         id_package,
         hotel_name,
         excursion,
         transport_type,
         guide_name,
         length,
         global_rating,
         nb_ratings,
         description,
         price,
         destination_id_destination,
         id_destination
      ) values (
         (SELECT NVL(MAX(id_package),0)+1 FROM "PACKAGE"),
         p_hotel_name,
         p_excursion,
         p_transport_type,
         p_guide_name,
         p_length,
         p_global_rating,
         p_nb_ratings,
         p_description,
         p_price,
         p_destination_id_destination,
         p_id_destination
      ) returning id_package into l_id;

      if upper(p_test) = 'N' then
         commit;
      end if;

      logger.append_param(l_params, 'id_package', l_id);
      logger.log('>>>FIN', l_scope, null, l_params);
      return router_succes('insert', l_id);
   exception
      when others then
         rollback;
         logger.log_error('ERR ' || sqlcode || ' ' || sqlerrm, l_scope, null, l_params);
         return router_erreur(sqlcode);
   end ins_package;


  --Update
   function upd_package (
      p_id_package                 "PACKAGE".id_package%type,
      p_hotel_name                 "PACKAGE".hotel_name%type default null,
      p_excursion                  "PACKAGE".excursion%type default null,
      p_transport_type             "PACKAGE".transport_type%type default null,
      p_guide_name                 "PACKAGE".guide_name%type default null,
      p_length                     "PACKAGE".length%type default null,
      p_global_rating              "PACKAGE".global_rating%type default null,
      p_nb_ratings                 "PACKAGE".nb_ratings%type default null,
      p_description                "PACKAGE".description%type default null,
      p_price                      "PACKAGE".price%type default null,
      p_destination_id_destination "PACKAGE".destination_id_destination%type default null,
      p_id_destination             "PACKAGE".id_destination%type default null,
      p_test                       varchar2 default 'N'
   ) return varchar2 is
      l_scope   logger_logs.scope%type := gc_scope_prefix || 'upd_package';
      l_params  logger.tab_param;
      r_pkg     "PACKAGE"%rowtype;
      l_reponse varchar2(4000);
   begin
      logger.append_param(l_params, 'id_package', p_id_package);
      logger.log('>>>DEBUT', l_scope, null, l_params);

      update "PACKAGE"
         set hotel_name                 = coalesce(p_hotel_name, hotel_name),
             excursion                  = coalesce(p_excursion, excursion),
             transport_type             = coalesce(p_transport_type, transport_type),
             guide_name                 = coalesce(p_guide_name, guide_name),
             length                     = coalesce(p_length, length),
             global_rating              = coalesce(p_global_rating, global_rating),
             nb_ratings                 = coalesce(p_nb_ratings, nb_ratings),
             description                = coalesce(p_description, description),
             price                      = coalesce(p_price, price),
             destination_id_destination = coalesce(p_destination_id_destination, destination_id_destination),
             id_destination             = coalesce(p_id_destination, id_destination)
       where id_package = p_id_package
      returning id_package, hotel_name, excursion, transport_type, guide_name, length,
                global_rating, nb_ratings, description, price,
                destination_id_destination, id_destination
                
       into r_pkg.id_package, r_pkg.hotel_name, r_pkg.excursion, r_pkg.transport_type,
            r_pkg.guide_name, r_pkg.length, r_pkg.global_rating, r_pkg.nb_ratings,
            r_pkg.description, r_pkg.price, r_pkg.destination_id_destination, r_pkg.id_destination;

      if sql%rowcount = 0 then
         raise no_data_found;
      end if;
      if r_pkg.price < 0 then
         raise exception_prix_negatif;
      end if;

      if upper(p_test) = 'N' then
         commit;
      end if;

      logger.append_param(l_params, 'id_package', r_pkg.id_package);
      logger.log('>>>FIN', l_scope, null, l_params);
      return router_succes('update', r_pkg.id_package);
   exception
      when others then
         rollback;
         logger.log_error('ERR ' || sqlcode || ' ' || sqlerrm, l_scope, null, l_params);
         return router_erreur(sqlcode);
   end upd_package;

--Delete
   function del_package (
      p_id_package "PACKAGE".id_package%type,
      p_test       varchar2 default 'N'
   ) return varchar2 is
      l_scope   logger_logs.scope%type := gc_scope_prefix || 'del_package';
      l_params  logger.tab_param;
      r_pkg     "PACKAGE"%rowtype;
      l_reponse varchar2(4000);
   begin
      logger.append_param(l_params, 'id_package', p_id_package);
      logger.append_param(l_params, 'test', p_test);
      logger.log('>>>DEBUT', l_scope, null, l_params);

      if p_id_package is null then
         raise no_data_found;
      end if;

      delete from "PACKAGE"
       where id_package = p_id_package
      returning id_package, hotel_name, excursion, transport_type, guide_name, length,
                global_rating, nb_ratings, description, price,
                destination_id_destination, id_destination

       into r_pkg.id_package, r_pkg.hotel_name, r_pkg.excursion, r_pkg.transport_type,
            r_pkg.guide_name, r_pkg.length, r_pkg.global_rating, r_pkg.nb_ratings,
            r_pkg.description, r_pkg.price, r_pkg.destination_id_destination, r_pkg.id_destination;

      if sql%rowcount = 0 then
         raise no_data_found;
      end if;

      if upper(p_test) = 'N' then
         commit;
      end if;

      logger.append_param(l_params, 'id_package', r_pkg.id_package);
      logger.log('>>>FIN', l_scope, null, l_params);
      l_reponse := router_succes('delete', r_pkg.id_package);
      return l_reponse;
   exception
      when others then
         rollback;
         logger.log_error('ERR ' || sqlcode || ' ' || sqlerrm, l_scope, null, l_params);
         return router_erreur(sqlcode);
   end del_package;


--Select
   function get_package (
      p_id_package "PACKAGE".id_package%type
   ) return varchar2 is
      l_scope   logger_logs.scope%type := gc_scope_prefix || 'get_package';
      l_params  logger.tab_param;
      l_reponse varchar2(4000);
   begin
      logger.append_param(l_params, 'id_package', p_id_package);
      logger.log('>>>DEBUT', l_scope, null, l_params);

      l_reponse := router_succes('get', p_id_package);

      logger.log('>>>FIN', l_scope, null, l_params);
      return l_reponse;
   exception
      when others then
         return router_erreur(sqlcode);
   end get_package;

end package_tapi;
/
SHOW ERRORS;
