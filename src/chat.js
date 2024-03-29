import React from "react";
import "./assets/css/chat.css";
import Loading from "./components/Loading";

class Chat extends React.Component {
    constructor(){
       /*  document.querySelector("nav > a:first-child").classList.remove("notification"); */
        super()
        this.state = {
            oldMessages: null,
            newMessages: null,
            username: JSON.parse(localStorage.getItem("arg_user"))["name"],
            userID: JSON.parse(localStorage.getItem("arg_user"))["id"],
            index: 0,
            place: localStorage.getItem("arg_place") ?? 10,
            sendingMessage: false,
            tipIndex: parseInt(localStorage.getItem("arg_tipIndex"))
        }
        this.chatHandler = this.chatHandler.bind(this);
    }

    async componentDidMount(){
        if( document.querySelector("#chatNav") ) document.querySelector("#chatNav").classList.remove("notification");
        localStorage.getItem("arg_tipIndex") ?? localStorage.setItem("arg_tipIndex", 0);
        await this.initializeMessages();
        this.scrollDown()
    }

    /**
     * Used to scroll down when new message arrives.
     */
    componentDidUpdate() {
        this.scrollDown();
      }

      /**
       * Sets messages according to initial start, puzzle or chat.
       * Triggers first message if npc writes, then scrolls down.
       */
    async initializeMessages(){
        console.log("inital messages");
        this.setOldMessages();
        this.scrollDown();
    }



    /**
     * Fetches all chatmessages Player should has gotten so far
     * @returns {array}
     */
    async setOldMessages(){
        let messages;
        console.log(this.state.oldMessages);
        console.log(this.state.newMessages);
        if( !this.state.oldMessages && this.state.index == 0 ){
            const userID = this.state.userID;
            const request = new Request(`https://dev.svnoak.net/api/dialog/chat/${userID}`);
    
            const response = await fetch(request);
            messages = await response.json();
            console.log("fetching old messages");
            this.setState({oldMessages: messages}, () => {
                this.setNewMessages(this.state.oldMessages)
                console.log("Set old messages");
                this.sendFirstMessage();
            });
        } else {
            messages = this.state.oldMessages;
            console.log("Has already old messages");
            this.setNewMessages(messages);
        }
        
    }

    /**
     * Sets new messages accordingly if it's tips during a puzzle or a dialog after meeting a npc.
     * @param {array} oldMessages - The fetched oldMessages to check  if there are any.
     */
    async setNewMessages(oldMessages){
        console.log(oldMessages);
        let newMessages;
        // Both items are set by camera component after dialog or during puzzle.
        // Puzzlecomponent resets puzzletips, but chat component resets dialog.
        let localDialog = JSON.parse(localStorage.getItem("arg_dialog"));
        let puzzleTips = JSON.parse(localStorage.getItem("arg_puzzleTips"));
        console.log(puzzleTips);

        // Check if any dialog
        if( localDialog && localDialog.length > 0){
            console.log("local!");
            newMessages = localDialog;

        // Check if any puzzle
        } else if( puzzleTips && puzzleTips.length > 0 ){
            console.log("PUZZLETIPS!");
            let puzzleMessages = this.createPuzzleMessages(puzzleTips);
            let index = this.state.tipIndex;
            console.log(puzzleMessages);

            // Get amount of tips already used and render accordingly
            if( index > 0 ){
                let oldPuzzles = puzzleMessages.splice(0, index);
                if( this.state.oldMessages ){
                    let newArr = this.state.oldMessages;
                    oldPuzzles.forEach( puzzle => newArr.push(puzzle) );
                    this.setState({oldMessages: newArr});
                }
            }
            newMessages = puzzleMessages;
            console.log(newMessages);

            // Checks if any oldMessages are available
        } else if( oldMessages.length == 0) {
            console.log(" Initial messages ");
            newMessages = await this.fetchInitialMessages();
        }

        console.log(newMessages);
        // Sets the state for all new Messages.
        this.setState({newMessages: newMessages}, this.sendFirstMessage(newMessages));
    }

    /**
     * Creates puzzle dialog objects for the chat.
     * @param {array} messages - Array of Strings, each string one tip.
     * @returns {array} - Array of objects in the same format as the other dialogs
     */
    createPuzzleMessages(messages){
        let tipsArr = [];
        let userMessage = {
            speaker: "player",
            text: "Kan du hjälpa mig?",
            tip: true
        }
        messages.forEach(message => {
            let obj = {
                speaker: "anon",
                text: message,
                delay: 2000,
                tip: true
            }
            tipsArr.push(userMessage, obj);
        });
        return tipsArr;
    }

    /**
     * Gets the inital messages, if player hasn't had any messages before.
     * @returns {array} Array of objects with messages
     */
    async fetchInitialMessages(){
        const userID = this.state.userID;
        const request = new Request(`https://dev.svnoak.net/api/dialog/initial/${userID}`);
        const response = await fetch(request);
        const json = await response.json();
        return await json;
    }

    /**
     * Renders all messages from oldMessages array.
     * @returns {HTMLElement}
     */
    renderList(){
        let oldMessages = this.state.oldMessages;
        let list = (
        <div className="messageList">
        { 
            oldMessages && oldMessages.map( (oldMessage, index) => {
                //if( oldMessages[index-1] && oldMessages[index-1].speaker == oldMessage.speaker ) oldMessage.speaker = "";
                return (
                <Message
                key={index}
                sender={oldMessage.speaker}
                text={oldMessage.text}
                imageLink={oldMessage.imageLink}
                user={this.state.username}
                link={oldMessage.link}
                />
                )
            })
        }
        { this.state.sendingMessage && <Loading /> }
        </div>
        )

        return list;
    }

    /**
     * Is used as clickevent Handler and sends responses to player.
     * @param {string} sender - Only player triggers another message
     */
    async chatHandler(sender){
        const index = this.state.index;
        const newMessages = this.state.newMessages;
        const message = newMessages[index];
        const nextMessage = newMessages[index+1];
        const overNextMessage = newMessages[index+2];

        console.log(message);
        if( sender == "player" ){
            this.sendMessage(message);
            document.querySelector(".userInput").value = "";
            if( nextMessage && nextMessage.speaker == "anon"){
                setTimeout( () => this.setState({sendingMessage: true}), 1000 );
                setTimeout( () => this.setState({sendingMessage: false}), nextMessage.delay);
                await this.sendMessage(nextMessage);

/*                 if( overNextMessage && overNextMessage.speaker == "anon" ){
                    setTimeout( () => this.setState({sendingMessage: true}), 1000 );
                    setTimeout( () => this.setState({sendingMessage: false}), overNextMessage.delay);
                    this.sendMessage(overNextMessage);
                } */
            }
        }
    }

    /**
     * Renders message in the list above the userInput
     * @param {object} message - messageObject in the format delivered by the API
     * @returns {bool}
     */
     async sendMessage(message){
        console.log("Sending message");
        console.log(message);
        let delay;
        message.delay ? delay = message.delay : delay = 0;
        setTimeout(() => {
            let newArr = this.state.oldMessages;
            console.log(newArr);
            newArr.push(message);
            console.log(newArr);
            this.setState({
                oldMessages: newArr,
                index: this.state.index + 1
            })
            if( message.markDone ) {
                console.log(message.markDone);
                this.markDone(message.id);
                localStorage.setItem("arg_dialog", "[]");
            } else if( message.tip ){
                let index = this.state.tipIndex;
                this.setState({tipIndex: index + 1});
                localStorage.setItem("arg_tipIndex", index + 1);
            }
            if( message.camera ) document.querySelector("#cameraNav").classList.add("notification");
            if( message.reward ) document.querySelector("#inventoryNav").classList.add("notification");
            }, delay);
    }

    /**
     * Checks if first message is from npc and sends it to user
     */
     sendFirstMessage(messages){
        const index = this.state.index;
        const newMessages = messages;
        if( newMessages ){
            console.log(newMessages);
            const firstMessage = newMessages[0];
            console.log(firstMessage);
            const oldMessages = this.state.oldMessages;
            if( firstMessage ){
                console.log("FIRST MESSAGE");
                if( index == 0 && firstMessage.speaker == "anon" ){
                    console.log("SENDING FIRST MESSAGE");
                    this.sendMessage(firstMessage);
                }
            }
        }
    }


    /**
     * Used to mark a dialog finished, will then come up as oldMessage in the future
     * @param {int} dialogID - ID of dialog that was finished
     */
    markDone(dialogID){
        const request = new Request(`https://dev.svnoak.net/api/dialog/done`);
        const data = {
            dialog: dialogID,
            user: this.state.userID,
            place: this.state.place,
            answer: ""
        }

        fetch(request ,{
            method: 'POST',
            headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then( response => response.json() )
        .then( data => console.log(data) );
    }

    /**
     * Scrolls down to latest message
     */
    scrollDown(){
        if( document.querySelector(".messageList") ){
            document.querySelector(".messageList").scrollTop = document.querySelector(".messageList").scrollHeight;
        }
    }

    /**
     * Checks if any messages need to be displayed in userInput.
     * Renders Chat component.
     * @returns {HTML Element}
     */
    render(){
        let userInput;
        if( this.state.newMessages ){
            const message = this.state.newMessages[this.state.index];
            if( message && message.speaker == "player" ){
                userInput = message.text;
            }
        }
        this.scrollDown();
        return (
            <div id="chat">
            { this.renderList() }
            <UserInput 
            text={userInput}
            chatHandler={this.chatHandler}
                />
                </div>
         );
    }
}

/**
 * userInput prefilled with value to be sent
 * @param {object} props - message Object 
 * @returns {HTML Element}
 */
function UserInput(props){;
    return(
        <div className="userInputBox">
            <textarea className="userInput" disabled value={props.text}></textarea>
            <div className="sendButton" onClick={() => props.text ? props.chatHandler("player") : ""}>SKICKA</div>
        </div>
    )
    
}

/**
 * Returns every individual message and puts appropriate images or classes depending on object.
 * @param {object} props - message Object 
 * @returns {HTML Element}
 */
function Message(props){
    return(
        <div className={"message " + props.sender}>
            { props.imageLink && <img src={"https://dev.svnoak.net/assets/images/" + props.imageLink}></img> }
            <div className="messageText">
                { props.text } {props.link && <a href={"https://dev.svnoak.net/assets/files/" + props.link} download target="_blank">Om Älvor</a>}
            </div>
        </div>
    )
}

 
export default Chat;