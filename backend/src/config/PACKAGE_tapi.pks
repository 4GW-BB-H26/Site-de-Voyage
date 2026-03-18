create or replace package package_tapi is

-- creation de mes exception globale
   exception_destination_invalide exception;
   exception_prix_negatif exception;
   exception_package_introuvable exception;
   pragma exception_init ( exception_destination_invalide,-20001 );
   pragma exception_init ( exception_prix_negatif,-20002 );
   pragma exception_init ( exception_package_introuvable,-20003 );
   type package_tapi_rec is record (
         id_package                 number,
         hotel_name                 varchar2(100),
         excursion                  varchar2(100),
         transport_type             varchar2(50),
         guide_name                 varchar2(50),
         length                     number,
         global_rating              number,
         nb_ratings                 number,
         description                varchar2(250),
         price                      number,
         destination_id_destination number,
         id_destination             number
   );
   type package_tapi_tab is
      table of package_tapi_rec;

   /**
    * Description   Fonction qui permet d'insérer un nouveau package touristique.
    *
    * @version      1.0.0    Version initiale
    *
    * @example      l_json := package_tapi.ins_package('Hotel X', 'Safari', 'Bus', 'John Doe', 7, 4.5, 10, 'Belle excursion', 1200, 1, 1, 'N');
    *
    * @issue        1
    *
    * @author       Ara Ghahramanyan
    * @created      2026-03-15
    *
    * @param        {varchar2} p_hotel_name Nom de l'hôtel.
    * @param        {varchar2} p_excursion Nom ou description de l'excursion.
    * @param        {varchar2} p_transport_type Type de transport utilisé.
    * @param        {varchar2} p_guide_name Nom du guide.
    * @param        {number}   p_length Durée du séjour (par exemple en jours).
    * @param        {number}   p_global_rating Note globale du package.
    * @param        {number}   p_nb_ratings Nombre de notes reçues.
    * @param        {varchar2} p_description Description détaillée du package.
    * @param        {number}   p_price Prix du package.
    * @param        {number}   p_destination_id_destination Identifiant de la destination (clé étrangère).
    * @param        {number}   p_id_destination Identifiant logique de la destination.
    * @param        {varchar2} p_test Indicateur de test ('N' pour commit, autre pour rollback).
    *
    * @return       {varchar2}  Retourne un JSON contenant un objet data/meta en cas de succès ou un objet errors en cas d’erreur.
    *
    * @exception    100:   Package non trouvé (cas rares liés aux validations).
    * @exception   -20001: Destination invalide.
    * @exception   -20002: Prix négatif.
    * @exception   -20003: Package introuvable.
    * @exception   -998:  Erreur de parsing: si le JSON n'est pas valide.
    * @exception   -997:  Format de réponse inattendu: le format est non conforme.
    * @exception   -999:  Erreur serveur: toute erreur qui n'est pas prévue dans le bloc catch.
    */
   function ins_package (
      p_hotel_name                 varchar2,
      p_excursion                  varchar2,
      p_transport_type             varchar2,
      p_guide_name                 varchar2,
      p_length                     number,
      p_global_rating              number,
      p_nb_ratings                 number,
      p_description                varchar2,
      p_price                      number,
      p_destination_id_destination number,
      p_id_destination             number,
      p_test                       varchar2 default 'N'
   ) return varchar2;

   /**
    * Description   Fonction qui permet de mettre à jour un package existant.
    *
    * @version      1.0.0    Version initiale
    *
    * @example      l_json := package_tapi.upd_package(1, p_price => 1500);
    *
    * @issue        1
    *
    * @author       Ara Ghahramanyan
    * @created      2026-03-15
    *
    * @param        {number}   p_id_package Identifiant unique du package à modifier.
    * @param        {varchar2} p_hotel_name Nouveau nom de l'hôtel (optionnel).
    * @param        {varchar2} p_excursion Nouveau nom/description de l'excursion (optionnel).
    * @param        {varchar2} p_transport_type Nouveau type de transport (optionnel).
    * @param        {varchar2} p_guide_name Nouveau nom du guide (optionnel).
    * @param        {number}   p_length Nouvelle durée du séjour (optionnel).
    * @param        {number}   p_global_rating Nouvelle note globale (optionnel).
    * @param        {number}   p_nb_ratings Nouveau nombre de notes (optionnel).
    * @param        {varchar2} p_description Nouvelle description (optionnel).
    * @param        {number}   p_price Nouveau prix (optionnel).
    * @param        {number}   p_destination_id_destination Nouvelle destination (clé étrangère, optionnel).
    * @param        {number}   p_id_destination Nouvel identifiant logique de destination (optionnel).
    * @param        {varchar2} p_test Indicateur de test ('N' pour commit, autre pour rollback).
    *
    * @return       {varchar2}  Retourne un JSON contenant le package mis à jour (data/meta) ou un objet errors.
    *
    * @exception    100:   Package non trouvé: aucun package ne correspond à l'identifiant.
    * @exception   -20001: Destination invalide.
    * @exception   -20002: Prix négatif.
    * @exception   -20003: Package introuvable.
    * @exception   -998:  Erreur de parsing: si le JSON n'est pas valide.
    * @exception   -997:  Format de réponse inattendu: le format est non conforme.
    * @exception   -999:  Erreur serveur: toute erreur qui n'est pas prévue dans le bloc catch.
    */
   function upd_package (
      p_id_package                 number,
      p_hotel_name                 varchar2 default null,
      p_excursion                  varchar2 default null,
      p_transport_type             varchar2 default null,
      p_guide_name                 varchar2 default null,
      p_length                     number default null,
      p_global_rating              number default null,
      p_nb_ratings                 number default null,
      p_description                varchar2 default null,
      p_price                      number default null,
      p_destination_id_destination number default null,
      p_id_destination             number default null,
      p_test                       varchar2 default 'N'
   ) return varchar2;

   /**
    * Description   Fonction qui permet de supprimer un package.
    *
    * @version      1.0.0    Version initiale
    *
    * @example      l_json := package_tapi.del_package(1);
    *
    * @issue        1
    *
    * @author       Ara Ghahramanyan
    * @created      2026-03-15
    *
    * @param        {number}   p_id_package Identifiant unique du package à supprimer.
    * @param        {varchar2} p_test Indicateur de test ('N' pour commit, autre pour rollback).
    *
    * @return       {varchar2}  Retourne un JSON meta (succès) ou un objet errors.
    *
    * @exception    100:   Package non trouvé: aucun package ne correspond à l'identifiant.
    * @exception   -20003: Package introuvable.
    * @exception   -998:  Erreur de parsing: si le JSON n'est pas valide.
    * @exception   -997:  Format de réponse inattendu: le format est non conforme.
    * @exception   -999:  Erreur serveur: toute erreur qui n'est pas prévue dans le bloc catch.
    */
   function del_package (
      p_id_package in number,
      p_test       in varchar2 default 'N'
   ) return varchar2;

   /**
    * Description   Fonction qui permet de récupérer un package par son identifiant.
    *
    * @version      1.0.0    Version initiale
    *
    * @example      l_json := package_tapi.get_package(1);
    *
    * @issue        1
    *
    * @author       Ara Ghahramanyan
    * @created      2026-03-15
    *
    * @param        {number} p_id_package Identifiant unique du package.
    *
    * @return       {varchar2}  Retourne un JSON contenant un objet data/meta ou un objet errors.
    *
    * @exception    100:   Package non trouvé: aucun package ne correspond à l'identifiant.
    * @exception   -20003: Package introuvable.
    * @exception   -998:  Erreur de parsing: si le JSON n'est pas valide.
    * @exception   -997:  Format de réponse inattendu: le format est non conforme.
    * @exception   -999:  Erreur serveur: toute erreur qui n'est pas prévue dans le bloc catch.
    */
   function get_package (
      p_id_package in number
   ) return varchar2;

end package_tapi;
/
SHOW ERRORS;
