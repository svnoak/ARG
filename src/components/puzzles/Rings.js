/**
 * Displays Textbased/imagebased puzzles
 * @param {object} props - Object from state.dialog and state.answer 
 * @returns 
 */
function PuzzleRings(props){
    return(
      <div id="puzzleBox">
        <p className="info">{props.text}</p>
        <input type="text"></input>
        { props.answer ? <div className="wrongAnswer">"{props.answer}" är ej rätt svar. Kanske min vän kan hjälpa mig?</div> : <div></div> }
        <button onClick={ () => props.handler() }>Detta är mitt svar</button>
      </div>
    )
  }

export default PuzzleRings;