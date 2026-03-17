//API pour la table USERS 
//Ce script a ete inspiree du fichier Revision mysql avec nodejs fourni pas m.Rim Mseddi 

import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";


const oracledb = require('oracledb');



async function SeConnecter(){ //pour pouvoir se connecter a la db
    try{
        const connexion = oracledb.getConnection(dbConfig);
        console.log("Connexion reussi!")

        return connexion
    }catch(err){
        console.error('erreur de connexion : Verifie les credentiel. Erreur : ', err)
    }
}

async function ShowUsers(connexion) { // fonction qui affiche la liste des utilisateurs, utile pour la page admin
    const result = (await connexion).execute(
        'SELECT * FROM USERS;'
    )
    console.table(result.rows);
};

async function FindUser(connexion, Courriel, MDP){
    const result = (await connexion).execute(
        'SELECT EMAIL, PASSWORD FROM USERS WHERE EMAIL := courriel AND PASSWORD := MDP', {Courriel, MDP}
    );

    if(result.rows().length > 0){
        console.log("connection reussi!")
        return true;
    }else{
        console.log("Erreur de connexion :(")
        return false;
    }
}
