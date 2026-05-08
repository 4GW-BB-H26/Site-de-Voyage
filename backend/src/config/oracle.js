import oracledb from "oracledb";

//Pour renvoi du texte en STRING

export const OUT_STRING = {
  dir: oracledb.BIND_OUT,
  type: oracledb.STRING,
  maxSize: 40000,
};
