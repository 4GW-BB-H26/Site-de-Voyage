import oracledb from "oracledb";

/** Bind OUT pour les procédures PL/SQL qui renvoient du JSON en chaîne */
export const OUT_STRING = {
  dir: oracledb.BIND_OUT,
  type: oracledb.STRING,
  maxSize: 40000,
};
