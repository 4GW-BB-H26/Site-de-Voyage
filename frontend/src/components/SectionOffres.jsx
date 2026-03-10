import CarteOffre from "./CarteOffre";

// Liste des réservations de l'utilisateur
export default function SectionOffres() {
  return (
    <section className="section-offres">
      <h2 className="titre-section">Mes réservations</h2>
      <p>Consultez l&apos;ensemble de vos réservations passées et à venir.</p>

      <div className="grille-offres">
        <CarteOffre
          imageUrl="https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg"
          imageAlt="Paris, France"
          ville="Paris, France"
          dates="Du 15 mars 2026 au 22 mars 2026"
          voyageurs="2 voyageurs"
          statut="Validée"
          typeStatut="validee"
          prix="1850 CAD"
        />

        <CarteOffre
          imageUrl="https://images.pexels.com/photos/373290/pexels-photo-373290.jpeg"
          imageAlt="Tokyo, Japon"
          ville="Tokyo, Japon"
          dates="Du 10 avril 2026 au 20 avril 2026"
          voyageurs="3 voyageurs"
          statut="Validée"
          typeStatut="validee"
          prix="4250 CAD"
        />

        <CarteOffre
          imageUrl="https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg"
          imageAlt="New York, États-Unis"
          ville="New York, États-Unis"
          dates="Du 5 mai 2026 au 22 janvier 2026"
          voyageurs="4 voyageurs"
          statut="À venir"
          typeStatut="avenir"
          prix="2500 CAD"
        />

        <CarteOffre
          imageUrl="https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg"
          imageAlt="Barcelone, Espagne"
          ville="Barcelone, Espagne"
          dates="Du 15 juin 2028 au 22 juin 2028"
          voyageurs="3 voyageurs"
          statut="Annulée"
          typeStatut="annulee"
          prix="3000 CAD"
        />
      </div>
    </section>
  );
}