import CarteReservation from "./CarteReservation";

const reservations = [
    {
        id: 1,
        destination: "Paris",
        country: "France",
        startDate: "2026-03-15",
        endDate: "2026-03-22",
        travelers: 2,
        status: "Validée",
        price: 1850,
        imgUrl: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
   },
{
        id: 2,
        destination: "Tokyo",
        country: "Japon",
        startDate: "2026-04-10",
        endDate: "2026-04-20",
        travelers: 3,
        status: "Validée",
        price: 4250,
        imgUrl: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
   },
   {
        id: 3,
        destination: "New York",
        country: "États-Unis",
        startDate: "2026-05-05",
        endDate: "2026-05-22",
        travelers: 4,
        status: "À venir",
        price: 2500,
        imgUrl: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
   },
   {
        id: 4,
        destination: "Barcelone",
        country: "Espagne",
        startDate: "2026-06-15",
        endDate: "2026-06-22",
        travelers: 3,
        status: "Annulée",
        price: 3000,
        imgUrl: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
   },

];

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("fr-CA", {
        day: "numeric", month: "long", year: "numeric",
    } );

export default function SectionReservation() {
    return (
        <section className="section-reservation">
            <h2 className="titre-section">Mes réservations</h2>
            <p className="sous-titre-reservations"> Consultez l'ensemble de vos réservations passées et à venir .</p>

            <div className="list-reservation">
                {reservations.map((rt) => (
                    <CarteReservation
                        key={rt.id}
                        imageUrl={rt.imgUrl}
                        imageAlt={'${rt.destination}, ${rt.country}'}
                        ville={'${rt.destination}, ${rt.country}'}
                        dates={'Du ${formatDate(r.startDate)} au ${formatDate(rt.endDate)}'}
                        voyageurs={'${rt.travelers} Voyageur${rt.travelers > 1 ? "s" : ""}'}
                        statut={rt.status}
                        typeStatut={rt.status}
                        prix={'${rt.price.toLocaleString("fr-CA")} CA$'}
                    />
                ))}
            </div>
        </section>
    );
}