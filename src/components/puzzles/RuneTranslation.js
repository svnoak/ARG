import { useEffect } from "react";

/**
 * Displays Textbased/imagebased puzzles
 * @param {object} props - Object from state.dialog and state.answer 
 * @returns 
 */
 function RuneTranslation(props){
   console.log(props);

    useEffect(() => {
      props.video();
    })

    return(
      <div id="puzzleBox">
        <img src={"https://dev.svnoak.net/assets/images/" + props.image} alt="Runor som ska översättas från kvarngubbens papper" className="image-puzzle-1"/>
        <p className="info">{props.text}</p>
        <input type="text" className="input"></input>
        { props.answer ? <div className="wrongAnswer">"{props.answer}" verkar inte helt rätt. Jag kanske borde fråga Anon...</div> : <div></div> }
        <button onClick={ props.handler }>Nu vet jag!</button>
      </div>
    )
  }

export default RuneTranslation;