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
    * @param            p_id_user
    * @param            p_first_name
    * @param            p_last_name
    * @param            p_username
    * @param            p_email
    * @param            p_password
    * @param            p_creation_date
    * @return           l_answer
    * @           