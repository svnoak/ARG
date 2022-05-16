import { Link } from "react-router-dom";

function Outro() {
    let ending = JSON.parse(localStorage.getItem("arg_user"))["ending"];
    let success = ending == "success";
    console.log(ending);
    return(
        <div className="outro">
            <p>Barnen som har varit försvunna kliver försiktigt ut från kvarnen. När de närmar sig ljuset utifrån kisar de innan de får syn på dig.</p>
            <p>Ett barn frågar om ditt namn och vad dina avsikter är. Du berättar kortfattat om vad som har hänt och ger dem ditt förtroende om hur de blev tagna.</p>
            <p>Det tar ett tag innan de litar på dig, men slutligen gör dem det och följer med dig för att återförenas med sina familjer.</p>
            <p>Efter att du lämnar av barnen hos polisen och väntat till sista barnets föräldrar kommer förbi känner du att du äntligen kan bege dig hem.</p>
            { !success && <p>Efter all möda och slit börjar tröttheten slingra sig in i din kropp – men du kan inte sluta tänka på att älvorna kommer göra om något liknande i framtiden och du kan inte göra något åt det.</p>}
            { success && <p>Efter all möda och slit börjar tröttheten slingra sig in i din kropp – men det känns bra eftersom du lyckades stoppa att något liknande kommer hända igen.</p>}
            <p>Det är tur att barnen från detta årtionde iallafall är säkra. Sedan tänker du på artikeln du måste skriva som sammanfattar allt.</p>
            <p>Du funderar över det ända tills du kommer hem, men bestämmer för att ta en tupplur först innan du går tillbaka till arbetet.</p>
            <Link to="/article"><button>Nästa</button></Link>
        </div>
    );
}

export default Outro;