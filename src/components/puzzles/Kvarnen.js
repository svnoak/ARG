import { useEffect } from "react";

/**
 * Displays Textbased/imagebased puzzles
 * @param {object} props - Object from state.dialog and state.answer 
 * @returns 
 */
 function KvarnLock(props){

    useEffect(() => {
      props.video();
    })
  
    return(
      <div id="puzzleBox">
        <img src={props.image} alt="Ett hänglås med sifferkombination som behöver anges för att öppna det."/>
        <p className="info">{props.text}</p>
        <input type="text"></input>
        { props.answer ? <div className="wrongAnswer">"{props.answer}" verkar inte helt rätt. Jag kanske borde fråga Anon...</div> : <div></div> }
        <button onClick={ () => props.handler() }>Nu vet jag!</button>
      </div>
    )
  }

export default KvarnLock;