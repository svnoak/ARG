import React from "react";
import "./assets/css/chat.css";
import Loading from "./components/Loading";

class Chat extends React.Component {
    constructor(){
        super()
        let localDialog = localStorage.getItem("arg_dialog");
        this.state = {
            oldMessages: null,
            newMessages: localDialog ? JSON.parse(localDialog) : false,
            username: JSON.parse(localStorage.getItem("arg_user"))["username"],
            userID: JSON.parse(localStorage.getItem("arg_user"))["id"],
            index: 0,
            place: localStorage.getItem("arg_place"),
            sendingMessage: false
        }

        this.chatHandler = this.chatHandler.bind(this);
    }

    async componentDidMount(){
        await this.setOldMessages();
        this.sendFirstMessage();
        this.chatHandler("mount");
    }

    async setOldMessages(){
        const userID = 1;
        const request = new Request(`https://dev.svnoak.net/api/dialog/chat/${userID}`);

        const response = await fetch(request);
        const json = await response.json();
        this.setState({oldMessages: json});
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

    async chatHandler(sender){
        const index = this.state.index;
        const newMessages = this.state.newMessages;
        const message = newMessages[index];
        const nextMessage = newMessages[index+1];
        if( sender == "player" ){
            this.sendMessage(message);
            if( nextMessage && nextMessage.speaker == "anon"){
                console.log("SENDING MESSAGE");
                setTimeout( () => this.setState({sendingMessage: true}), 1000 );
                setTimeout( () => this.setState({sendingMessage: false}), nextMessage.delay);
                this.sendMessage(nextMessage);
            }
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
                    localStorage.setItem("arg_dialog", "{}");
                }
            }, delay);
        })

        return sentMessage;

    }


    render(){
        let userInput;
        const message = this.state.newMessages[this.state.index];
        if( message && message.speaker == "player" ){
            userInput = message.text;
        }
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
            <input type="text" className="userInput" disabled={!props.text} defaultValue={props.text}></input>
            <div className="sendButton" onClick={() => props.text ? props.chatHandler("player") : ""}>SKICKA</div>
        </div>
    )
    
}

function Message(props){
    let sender = props.sender == "player" ? props.user : "Anonymous";
    return(
        <div className={props.class}>
            {props.sender && 
            <div className="messageHeader">
                <div className="sender"> 
                    { sender }
                </div>
            </div>
            }
            { props.imageLink && <img src={"https://dev.svnoak.net/assets/images/" + props.imageLink}></img> }
            <div className="messageText">
                { props.text }
            </div>
        </div>
    )
}

 
export default Chat;