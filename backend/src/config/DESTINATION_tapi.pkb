create or replace package body destination_tapi is

-- insert
   function ins_destination (
      p_city       in destination.city%type,
      p_country    in destination.country%type,
      p_image_link in destination.image_link%type,
      p_test       varchar2 default 'N'
   ) return varchar2 as
   /**
    * Description: Fonction pour insérer une destination dans table DESTINATION.
    * @example: destination_tapi.ins_destination('Paris', 'France', 'lien.jpg'); 
    * @author Zidane R. Mansouri
    * @created 2026-03-10
    * @param: p_city = Nom de la ville
    * @param: p_country = Nom du pays
    * @param: p_image_link = Lien de l'image
    * @param: p_test: paramètre pour ne pas sauvegarder les tests, 
    * si 'N' alors commit
    * @return: varchar2 de la reponse JSON
    */
      gc_scope_prefix  constant varchar2(31) := lower($$plsql_unit)
                                               || '.';
      l_scope          logger_logs.scope%type := gc_scope_prefix || 'ins_destination';
      l_params         logger.tab_param;
      l_id_destination destination.id_destination%type;
      l_reponse        varchar2(4000);
   begin
      logger.append_param(
         l_params,
         'p_city',
         p_city
      );
      logger.append_param(
         l_params,
         'p_country',
         p_country
      );
      logger.append_param(
         l_params,
         'p_image_link',
         p_image_link
      );
      logger.append_param(
         l_params,
         'p_test: ',
         p_test
      );
      logger.log(
         '>>>DÉBUT de la fonction',
         l_scope,
         null,
         l_params
      );

    -- methode pour linsertion d'une destination    
      insert into destination (
         city,
         country,
         image_link
      ) values ( p_city,
                 p_country,
                 p_image_link ) returning id_destination into l_id_destination;

      logger.append_param(
         l_params,
         'l_id_destination',
         l_id_destination
      );
      logger.log(
         '>>>FIN de la fonction',
         l_scope,
         null,
         l_params
      );

    -- condition pour la verification d'un test 
      if p_test = 'N' then
         commit;
      end if;

    -- methode pour mettre l'objet jason a lintérieur de la variable l_reponse et creation d un objet JSON avec le status et l id inséré
      l_reponse :=
         json_object(
            key 'status' value 'success',
                     key 'statusCode' value 200,
                     key 'data' value
               json_object(
                  key 'id_destination' value l_id_destination
               )
         );

      return l_reponse;

-- exeption 
   exception
      when others then
         rollback;
         logger.log_error(
            'Exception non gérée When Others',
            l_scope,
            null,
            l_params
         );
         raise;
   end ins_destination;


-- update
   function upd_destination (
      p_city           in destination.city%type default null,
      p_id_destination in destination.id_destination%type,
      p_country        in destination.country%type default null,
      p_image_link     in destination.image_link%type default null,
      p_test           varchar2 default 'N'
   ) return varchar2 as

      gc_scope_prefix constant varchar2(31) := lower($$plsql_unit)
                                               || '.';
      l_scope         logger_logs.scope%type := gc_scope_prefix || 'upd_destination';
      l_params        logger.tab_param;
      r_destination   destination%rowtype;
      l_nbre_rangee   number;
      l_reponse       varchar2(4000);
      exception_id_is_null exception;
   begin
      logger.append_param(
         l_params,
         'p_id_destination',
         p_id_destination
      );
      logger.append_param(
         l_params,
         'p_city',
         p_city
      );
      logger.append_param(
         l_params,
         'p_country',
         p_country
      );
      logger.append_param(
         l_params,
         'p_image_link',
         p_image_link
      );
      logger.log(
         '>>>DÉBUT de la fonction',
         l_scope,
         null,
         l_params
      );
      if p_id_destination is null then
         raise exception_id_is_null;
      end if;
      select *
        into r_destination
        from destination
       where id_destination = p_id_destination;

      update destination
         set city = nvl(
         p_city,
         r_destination.city
      ),
             country = nvl(
                p_country,
                r_destination.country
             ),
             image_link = nvl(
                p_image_link,
                r_destination.image_link
             )
       where id_destination = p_id_destination;

      l_nbre_rangee := sql%rowcount;
      logger.append_param(
         l_params,
         'l_nbre_rangee',
         l_nbre_rangee
      );
      logger.log(
         '>>>FIN de la fonction',
         l_scope,
         null,
         l_params
      );
      if p_test = 'N' then
         commit;
      end if;
      select
         json_object(
            key 'nbre_rangee' value l_nbre_rangee
         )
        into l_reponse
        from dual;

      return l_reponse;
   exception
      when exception_id_is_null then
         dbms_output.put_line('Le id de la table destination est null');
         raise_application_error(
            -20001,
            'id_destination nexiste pas'
         );
   end upd_destination;


   function del_destination (
      p_id_destination in destination.id_destination%type,
      p_test           varchar2 default 'N'
   ) return varchar2 as

      gc_scope_prefix constant varchar2(31) := lower($$plsql_unit)
                                               || '.';
      l_scope         logger_logs.scope%type := gc_scope_prefix || 'del_destination';
      l_params        logger.tab_param;
      l_nbre_rangee   number;
      l_reponse       varchar2(4000);
      exception_id_is_null exception;
   begin
      logger.append_param(
         l_params,
         'p_id_destination',
         p_id_destination
      );
      logger.log(
         '>>>début de la procédure',
         l_scope,
         null,
         l_params
      );
      if p_id_destination is null then
         raise exception_id_is_null;
      end if;
      delete from destination
       where id_destination = p_id_destination;

      l_nbre_rangee := sql%rowcount;
      logger.append_param(
         l_params,
         'sql%rowcount',
         sql%rowcount
      );
      logger.log(
         '>>>fin de la procédure',
         l_scope,
         null,
         l_params
      );
      if p_test = 'N' then
         commit;
      end if;
      select
         json_object(
            key 'nbre_rangee' value l_nbre_rangee
         )
        into l_reponse
        from dual;

      return l_reponse;
   exception
      when exception_id_is_null then
         dbms_output.put_line('Le id de la table destination est null');
         rollback;
         raise_application_error(
            -20001,
            'id_destination nexiste pas'
         );
   end del_destination;


   function get_destination (
      p_id_destination in destination.id_destination%type
   ) return varchar2 as

      gc_scope_prefix    constant varchar2(31) := lower($$plsql_unit)
                                               || '.';
      l_scope            logger_logs.scope%type := gc_scope_prefix || 'get_destination';
      l_params           logger.tab_param;
      l_json_destination varchar2(4000);
      exception_id_is_null exception;
   begin
      logger.append_param(
         l_params,
         'p_id_destination',
         p_id_destination
      );
      logger.log(
         '>>>début de la fonction',
         l_scope,
         null,
         l_params
      );
      if p_id_destination is null then
         raise exception_id_is_null;
      end if;
      select
         json_object(*)
        into l_json_destination
        from destination
       where id_destination = p_id_destination;

      if l_json_destination is null then
         raise_application_error(
            -20003,
            'Aucune destination trouver!'
         );
      end if;
      logger.append_param(
         l_params,
         'l_json_destination',
         l_json_destination
      );
      logger.log(
         '>>>fin de la fonction',
         l_scope,
         null,
         l_params
      );
      return l_json_destination;
   exception
      when exception_id_is_null then
         dbms_output.put_line('Le id de la table destination est null');
         rollback;
         raise_application_error(
            -20001,
            'id_destination nexiste pas !'
         );
   end get_destination;

end destination_tapi;