import { useState, useEffect } from "react";
import { fetchSupportComments, addSupportComment } from "../api/comments";

export default function SectionSupport() {
  const [commentaires, setCommentaires] = useState([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Load tous les commentaires
  useEffect(() => {
    fetchSupportComments()
      .then((data) => {
        setCommentaires(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  //submit le form des commentaires
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    try {
      const nouveauCom = await addSupportComment(userName, comment);
      setCommentaires([nouveauCom, ...commentaires]);
      setUserName("");
      setComment("");
    } catch (err) {
      alert("Erreur lors de l'envoi du commentaire.");
    }
  };

  return (
    <section className="section-support">
      <h2 className="titre-section">Support</h2>
      <p className="sous-titre-reservations">
        Trouvez des réponses à vos questions dans notre <strong>FAQ</strong>, ou laissez un commentaire!
      </p>

      <div className="liste-support">
        <div className="carte-support">
          <h3 className="carte-support-titre">Création de compte</h3>
          <p className="carte-support-texte">
            <strong>Q :</strong> Comment je crée un compte ?
            <br />
            <strong>A :</strong> Il faut appuyer sur le bouton s'inscrire.
          </p>
        </div>
        <div className="carte-support">
          <h3 className="carte-support-titre">Réservation d'un paquet</h3>
          <p className="carte-support-texte">
            <strong>Q :</strong> Comment je crée un compte ?
            <br />
            <strong>A :</strong> Il faut appuyer sur le bouton s'inscrire.
          </p>
        </div>
        <div className="carte-support">
          <h3 className="carte-support-titre">Gestion des favoris</h3>
          <p className="carte-support-texte">
            <strong>Q :</strong> Comment je crée un compte ?
            <br />
            <strong>A :</strong> Il faut appuyer sur le bouton s'inscrire.
          </p>
        </div>
        <div className="carte-support">
          <h3 className="carte-support-titre">Annulation d'un paquet</h3>
          <p className="carte-support-texte">
            <strong>Q :</strong> Comment je crée un compte ?
            <br />
            <strong>A :</strong> Il faut appuyer sur le bouton s'inscrire.
          </p>
        </div>
        <div className="carte-support">
          <h3 className="carte-support-titre">Ligne d'assistance téléphonique</h3>
          <p className="carte-support-texte">
            <strong>Q :</strong> Comment je crée un compte ?
            <br />
            <strong>A :</strong> Il faut appuyer sur le bouton s'inscrire.
          </p>
          <p className="carte-support-telephone">Numéro: 1-514-888-2222</p>
        </div>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
        <h3>Laissez-nous un commentaire !</h3>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <input 
            type="text" 
            placeholder="Votre nom" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
            style={{ padding: "8px" }}
          />
          <textarea 
            placeholder="Votre message..." 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            required 
            rows="3"
            style={{ padding: "8px" }}
          />
          <button type="submit" style={{ padding: "10px", background: "#007BFF", color: "white", border: "none", cursor: "pointer" }}>
            Envoyer
          </button>
        </form>

        <div>
          {loading ? (
            <p>Chargement des commentaires...</p>
          ) : commentaires.length === 0 ? (
            <p>Aucun commentaire. Laissez-en un!</p>
          ) : (
            commentaires.map((com) => (
              <div key={com._id} style={{ background: "white", padding: "10px", marginBottom: "10px", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <strong>{com.userName}</strong> 
                <span style={{ fontSize: "0.8em", color: "gray", marginLeft: "10px" }}>
                  {new Date(com.date).toLocaleDateString()}
                </span>
                <p style={{ margin: "5px 0 0 0" }}>{com.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </section>
  );
}