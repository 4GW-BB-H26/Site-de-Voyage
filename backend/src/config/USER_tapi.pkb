--Script base sur le template fourni par m. Brodeur dans le cours de Systeme de base de donnees

Prompt Creation du pkb users_tapi.

CREATE OR REPLACE PACKAGE BODY users_tapi AS
    gc_scope_prefix CONSTANT VARCHAR(31) := lower($$plsql_unit) || '.';

/**
    * Description       fonction pour creer un utilisateur
    *
    * @version          premiere version
    *
    * @author           Charbel Barrak
    * @Created          2026-03-15
    * @param            p_id_user       id du user
    * @param            p_first_name    le nom du user
    * @param            p_last_name     nom de famille du user
    * @param            p_username      nom d'utilisateur du user
    * @param            p_email         l'addresse courriel du user
    * @param            p_password      le mdp du user
    * @param            p_creation_date la date de creation du compte
    * @return           l_answer        un objet JSON avec les info du user
    * @exception        OTHERS          les exceptions
*/

FUNCTION ins_user (
    p_id_user USERS.ID_USERS%type,
    p_first_name USERS.FIRST_NAME%type,
    
)