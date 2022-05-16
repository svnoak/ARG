/**
 * Displays Textbased/imagebased puzzles
 * @param {object} props - Object from state.dialog and state.answer 
 * @returns 
 */
 function AlvkungenRunes(props){
    return(
      <div id="puzzleBox">
        <img src={"https://dev.svnoak.net/assets/images/" +  props.image} alt="Runor från Alvkungen"/>
        <img src={"https://dev.svnoak.net/assets/images/pusselmoment_bokstäver.png"} alt="Runor från Alvkungen"/>
        <p className="text">{props.text}</p>
        <input type="text"></input>
        <button onClick={ () => props.handler() }>Detta är det!</button>
      </div>
    )
  }

export default AlvkungenRunes;