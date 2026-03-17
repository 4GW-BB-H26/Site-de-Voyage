//API pour la table USERS 
//Ce script a ete inspiree du fichier Revision mysql avec nodejs fourni pas m.Rim Mseddi 

import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";
import logger from "./logger.js";

const oracledb = require('oracledb');

const connexion = oracledb.getConnection(dbConfig);

connexion.connect(err => {
    if(err) {
        console.error('Erreur de Connection :', err);
        return;
    }
    console.log('Connecter a la Base de donnees')
});

async function ShowUser(name, age) {
    const result = (await connexion).execute(
        'SELECT'
    )};
