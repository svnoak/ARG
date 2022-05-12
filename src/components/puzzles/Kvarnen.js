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

    function nextField(event){
      const target = event.target;
      if( target.value.length == target.maxLength && target.nextElementSibling ) target.nextElementSibling.focus();
      if( target.value.length == 0 && target.previousElementSibling ) target.previousElementSibling.focus();
    }
  
    return(
      <div id="puzzleBox">
        <p className="info">{props.text}</p>
        <div className="lock">
        <input type="text" pattern="[0-9]*" inputMode="numeric" min="0" max="9" maxLength="1" onChange={nextField}></input>
        <input type="text" pattern="[0-9]*" inputMode="numeric" min="0" max="9" maxLength="1" onChange={nextField}></input>
        <input type="text" pattern="[0-9]*" inputMode="numeric" min="0" max="9" maxLength="1" onChange={nextField}></input>
        </div>
        { props.answer ? <div className="wrongAnswer">"{props.answer}" är inte rätt kombination... Jag kanske borde fråga Anon...</div> : <div></div> }
        <button onClick={ () => props.handler() }>Öppna låset</button>
      </div>
    )
  }

export default KvarnLock;