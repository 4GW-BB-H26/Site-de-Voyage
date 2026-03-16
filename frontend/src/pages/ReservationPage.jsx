import BarreNavigation from "../components/BarreNavigation";
import SectionReservation from "../components/SectionReservation";
import SectionFooter from "../components/SectionFooter";

import "../styles/styles.css";

export default function LoginPage(){
    return(
        <div>
            <BarreNavigation/>
            <SectionReservation/>
            <SectionFooter/>
        </div>
        
    );
}