import { useState, useEffect } from "react";

export default function InfosPays({ nomPays }) {
  const [infos, setInfos] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const fetchInfosPays = async () => {
      try {
        setChargement(true);

        const res = await fetch(`https://restcountries.com/v3.1/name/${nomPays}`);
        
        if (!res.ok) {
          throw new Error("Informations sur le pays introuvables.");
        }
        
        const data = await res.json();
        setInfos(data[0]);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    if (nomPays) {
      fetchInfosPays();
    }
  }, [nomPays]);

  if (chargement) return <div className="pays-loading">Chargement des informations du pays...</div>;
  if (erreur) return <div className="pays-erreur">Impossible de charger les infos pour {nomPays}.</div>;
  if (!infos) return null;

  const monnaie = infos.currencies ? Object.values(infos.currencies)[0].name : "Non spécifiée";

  return (
    <div className="carte-infos-pays">
      <h3>Informations pratiques {infos.flag}</h3>
      <ul>
        <li><strong>Pays :</strong> {infos.translations?.fra?.common || infos.name.common}</li>
        <li><strong>Capitale :</strong> {infos.capital ? infos.capital[0] : "N/A"}</li>
        <li><strong>Population :</strong> {infos.population.toLocaleString("fr-FR")} habitants</li>
        <li><strong>Monnaie :</strong> {monnaie}</li>
        <li><strong>Région :</strong> {infos.region}</li>
      </ul>
    </div>
  );
}