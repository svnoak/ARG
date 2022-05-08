/**
 * Displays Textbased/imagebased puzzles
 * @param {object} props - Object from state.dialog and state.answer 
 * @returns 
 */
function Textpuzzle(props){
    let puzzleTips = JSON.stringify(props.dialog.tips);
    localStorage.setItem("arg_puzzleTips", puzzleTips);
    return(
      <div id="puzzleBox">
        <p className={props.dialog.type}>{props.dialog.text}</p>
        <input type="text"></input>
        { props.answer ? <div className="wrongAnswer">"{props.answer}" är ej rätt svar. Kanske min vän kan hjälpa mig?</div> : <div></div> }
        <button onClick={ () => props.handler(props.dialog.type) }>Detta är mitt svar</button>
      </div>
    )
  }

export default Textpuzzle;