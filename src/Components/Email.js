import React from "react";
import moment from 'moment';
import "../css/style.css"

class Email extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            read: parseInt(props.read) === 1 ? true : false,
            hidden: parseInt(props.id) === 1 ? true : false,
            color: undefined
        }
        this.markRead = this.markRead.bind(this);
    }

    markRead(){
        if( !this.state.read ) this.setState({read: true});
    }

    setAvatarColor(){
        if( !this.state.color ) this.setState({color: Math.floor(Math.random()*16777215).toString(16)});
    }

    componentDidMount(){
        this.setAvatarColor();
        setTimeout(() => {
            this.setState({hidden: false});
        }, 2000);
    }

    render() {
        moment.locale('sv');
        let day = parseInt(this.props.date) < 0
        ? moment().add(this.props.date, 'days').format("Do MMMM")
        : this.props.date;
        return (
            <div className={`email ${this.state.read ? "":"unread"} ${this.state.hidden ? "hidden" : ""}`} id={this.props.id}  onClick={() => {this.markRead(); this.props.showEmail(this.props.id)} } >
                <ReadIndicator read={this.state.read} />
                <Avatar shortName={this.props.firstName} color={this.state.color}/>
                <EmailContent day={day} data={this.props}/>
            </div>
        )
    }
}

function EmailContent(props){
    return(
        <div className="email-content">
            <div className="email-heading">
                <h2>{props.data.firstName} {props.data.lastName}</h2>
                <EmailDate date={props.day} />
            </div>
            <div className="email-body">
                <h3>{props.data.subject}</h3>
            </div>
        </div>
    )
}

function Avatar(props){
    const shortName = props.shortName.charAt(0).toUpperCase();
    return(
        <div className="avatar" style={{backgroundColor: '#' + props.color}}>
            <span>{shortName}</span>
        </div>
    )
}

function ReadIndicator(props){
    return <div className="read-indicator" style={{backgroundColor: props.read ? "lightgray" : "blue"  }}></div>
}

function EmailDate(props){
    return <p>{props.date}</p>;
}

export default Email;