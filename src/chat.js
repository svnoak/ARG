import React from "react";
import "./assets/css/chat.css";
import Loading from "./components/Loading";

class Chat extends React.Component {
    constructor(){
        super()
        let localDialog = localStorage.getItem("arg_dialog");
        this.state = {
            oldMessages: null,
            newMessages: [],
            username: JSON.parse(localStorage.getItem("arg_user"))["username"],
            userID: JSON.parse(localStorage.getItem("arg_user"))["id"],
            index: 0,
            place: localStorage.getItem("arg_place"),
            sendingMessage: false,
            tipIndex: parseInt(localStorage.getItem("arg_tipIndex"))
        }

        this.chatHandler = this.chatHandler.bind(this);
    }

    async componentDidMount(){
        localStorage.getItem("arg_tipIndex") ?? localStorage.setItem("arg_tipIndex", 0);
        await this.initializeMessages();
        this.scrollDown();
    }

    componentDidUpdate(prevProps, prevState) {
        this.scrollDown();
      }

    async initializeMessages(){
        let oldMessages = await this.setOldMessages();
        await this.setNewMessages(oldMessages);
        this.sendFirstMessage();
        this.scrollDown();
    }

    async setOldMessages(){
        const userID = 1;
        const request = new Request(`https://dev.svnoak.net/api/dialog/chat/${userID}`);

        const response = await fetch(request);
        let json = await response.json();
        this.setState({oldMessages: json});
        return json;
    }

    async setNewMessages(oldMessages){
        let newMessages;
        let localDialog = JSON.parse(localStorage.getItem("arg_dialog"));
        let puzzleTips = JSON.parse(localStorage.getItem("arg_puzzleTips"));
        if( localDialog.length > 0){
            newMessages = localDialog;
        } else if( puzzleTips.length > 0 ){
            let puzzleMessages = this.createPuzzleMessages(puzzleTips);
            let index = this.state.tipIndex;

            if( index > 0 ){
                let oldPuzzles = puzzleMessages.splice(0, index);

                if( this.state.oldMessages ){
                    let newArr = this.state.oldMessages;
                    oldPuzzles.forEach( puzzle => newArr.push(puzzle) );
                    this.setState({oldMessages: newArr});
                }
            }
            newMessages = puzzleMessages;
        } else if( oldMessages.length == 0) {
            newMessages = await this.fetchInitialMessages();
        }
        this.setState({newMessages: newMessages});
    }

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

    async fetchInitialMessages(){
        console.log("FETCH");
        const userID = this.state.userID;
        console.log(userID);
        const request = new Request(`https://dev.svnoak.net/api/dialog/initial/${userID}`);
        const response = await fetch(request);
        const json = await response.json();
        console.log(json);
        return json;
    }

    renderList(){
        let oldMessages = this.state.oldMessages;
        let list = (
        <div className="messageList">
        { 
            oldMessages && oldMessages.map( (oldMessage, index) => {
                oldMessage.class = oldMessage.speaker;
                if( oldMessages[index-1] && oldMessages[index-1].speaker == oldMessage.speaker ) oldMessage.speaker = "";
                if( oldMessages[index+1] && oldMessages[index+1].speaker == oldMessage.speaker ) oldMessage.class = "before";
                return (
                <Message 
                key={index} 
                sender={oldMessage.speaker} 
                text={oldMessage.text} 
                imageLink={oldMessage.imageLink} 
                user={this.state.username}
                class={oldMessage.class}                
                />
                )
            })
        }
        { this.state.sendingMessage && <Loading /> }
        </div>
        )

        return list;
    }

    sendFirstMessage(){
        const index = this.state.index;
        if( this.state.newMessages ){
            const firstMessage = this.state.newMessages[0];
            const oldMessages = this.state.oldMessages;
            if( firstMessage ){
                if( index == 0 && firstMessage.speaker == "anon" ){
                    if( oldMessages && oldMessages[oldMessages.length] != firstMessage ){
                        let newArr = this.state.oldMessages;
                        newArr.push(firstMessage);
                        this.setState({
                            oldMessages: newArr,
                            index: index+1
                        })
                    }
                }
            }
        }
        
    }

    async chatHandler(sender){
        const index = this.state.index;
        const newMessages = this.state.newMessages;
        const message = newMessages[index];
        const nextMessage = newMessages[index+1];
        console.log("message");
        if( sender == "player" ){
            this.sendMessage(message);
            if( nextMessage && nextMessage.speaker == "anon"){
                setTimeout( () => this.setState({sendingMessage: true}), 1000 );
                setTimeout( () => this.setState({sendingMessage: false}), nextMessage.delay);
                this.sendMessage(nextMessage);
            }
        }
        console.log("LocalStorage: " + localStorage.getItem("arg_tipIndex"));
    }

    scrollDown(){
        if( document.querySelector(".messageList") ){
            document.querySelector(".messageList").scrollTop = document.querySelector(".messageList").scrollHeight;
        }
    }

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

    sendMessage(message){
        let delay;
        message.delay ? delay = message.delay : delay = 0;
        const sentMessage = new Promise( () => {
            setTimeout(() => {
                let newArr = this.state.oldMessages;
                newArr.push(message);
                this.setState({
                    oldMessages: newArr,
                    index: this.state.index + 1
                })
                if( message.markDone ) {
                    this.markDone(message.id);
                    localStorage.setItem("arg_dialog", "[]");
                } else if( message.tip ){
                    let index = this.state.tipIndex;
                    this.setState({tipIndex: index + 1});
                    localStorage.setItem("arg_tipIndex", index + 1);
                }
            }, delay);
        })
        return sentMessage;
    }


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

function UserInput(props){;
    return(
        <div className="userInputBox">
            <input type="text" className="userInput" disabled defaultValue={props.text}></input>
            <div className="sendButton" onClick={() => props.text ? props.chatHandler("player") : ""}>SKICKA</div>
        </div>
    )
    
}

function Message(props){
    let sender = props.sender == "player" ? props.user : "Anonymous";
    return(
        <div className={"message " + props.class}>
            {/* {props.sender && 
            <div className="messageHeader">
                <div className="sender"> 
                    { sender }
                </div>
            </div>
            } */}
            { props.imageLink && <img src={"https://dev.svnoak.net/assets/images/" + props.imageLink}></img> }
            <div className="messageText">
                { props.text }
            </div>
        </div>
    )
}

 
export default Chat;