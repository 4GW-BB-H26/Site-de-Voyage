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
        //image temporaire avant que je connecte le frontend avec le backend
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
/*Certain changement que je ferais dans le future quand que je vais connecter la database avec le frontend

J'ajouterais {userID} dans la parenthese de la fonction

useEffect(() => {
        fetch(`http://localhost:3000/reservations/${userId}`)
            .then(res => { if (!res.ok) throw new Error("Erreur réseau"); return res.json(); })
            .then(data => { setReservations(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [userId]);

    Pour ceci, j'enleverais les données temporaires que j'avais en haut dans le document

    J'ajouterais aussi des messages qui vont apparaitre quand que la page load, a une erreur, ou
    qu'elle n'a de reservations dans la page.
*/
    return (
        <section className="section-reservation">
            <h2 className="titre-section">Mes réservations</h2>
            <p className="sous-titre-reservations"> Consultez l'ensemble de vos réservations passées et à venir .</p>

            <div className="list-reservation">
                {reservations.map((rt) => (
                    <CarteReservation
                        key={rt.id}
                        imageUrl={rt.imgUrl}
                        imageAlt={`${rt.destination}, ${rt.country}`}
                        ville={`${rt.destination}, ${rt.country}`}
                        dates={`Du ${formatDate(rt.startDate)} au ${formatDate(rt.endDate)}`}
                        voyageurs={`${rt.travelers} Voyageur${rt.travelers > 1 ? "s" : ""}`}
                        statut={rt.status}
                        typeStatut={rt.status}
                        prix={`${rt.price.toLocaleString("fr-CA")} CA$`}
                    />
                ))}
            </div>
        </section>
    );
}