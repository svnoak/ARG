import React from 'react';
import moment from 'moment';
import "../css/style.css"

class Email extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            read: parseInt(props.read) === 1 ? true : false,
        }
        this.markRead = this.markRead.bind(this);
    }

    markRead(){
        if( !this.state.read ) this.setState({read: true});
    }

    render() {
        moment.locale('sv');
        let day = parseInt(this.props.date) < 0
        ? moment().add(this.props.date, 'days').format("Do MMMM")
        : this.props.date;
        const email = (
            <div className={`email ${this.state.read ? "":"unread"}`} id={this.props.id}  onClick={this.showEmail}>
                <ReadIndicator read={this.state.read} />
                <Avatar shortName={this.props.firstName} />
                <div className="email-content">
                    <div className="email-heading">
                        <h2>{this.props.firstName} {this.props.lastName}</h2>
                        <EmailDate date={day} />
                    </div>
                    <div className="email-body">
                        <h3>{this.props.subject}</h3>
                    </div>
                    {this.props.detail === "true" &&
                        <div>
                        <Addresses address={this.props.address} />
                        <EmailText body={this.props.body} />
                        </div>
                    }                        
                </div>
            </div>
        )

        return(
            email
        )
    }
}

function Avatar(props){
    const shortName = props.shortName.charAt(0).toUpperCase();
    const color = Math.floor(Math.random()*16777215).toString(16);

    return(
        <div className="avatar" style={{backgroundColor: '#' + color}}>
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

function Addresses(props){
    return(
        <div className="adresses">
            <p>Från: {props.address}</p>
            <p>Till: namn@redaktionen.se</p>
        </div>
    )
}

function EmailText(props){
    return(
        <div className="email-text">
            {props.body}
        </div>
    )
}

export default Email;