/**
 * Displays Textbased/imagebased puzzles
 * @param {object} props - Object from state.dialog and state.answer 
 * @returns 
 */
 function AlvkungenRunes(props){
    return(
      <div id="puzzleBox">
        <img src={props.image} alt="Runor som ska översättas från kvarngubbens papper"/>
        <p className="info">{props.text}</p>
        <input type="text"></input>
        { props.answer ? <div className="wrongAnswer">"{props.answer}" verkar inte helt rätt. Jag kanske borde fråga Anon...</div> : <div></div> }
        <button onClick={ () => props.handler() }>Nu vet jag!</button>
      </div>
    )
  }

export default AlvkungenRunes;