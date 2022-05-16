import { Link } from "react-router-dom";

function Article() {
    return(
        <div className="outro">
            <img className="tidning" src="https://dev.svnoak.net/assets/images/tidningsartikel.png" alt="Tidningsartikel du har skrivit om barnen" />
            <Link to="/anteckningar"><button>Tillbaka till anteckningarna</button></Link>
        </div>
    );
}

export default Article;