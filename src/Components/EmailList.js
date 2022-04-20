import React from "react";
import Email from "./Email";

class EmailList extends React.Component{

    render(){

        const emails = this.props.state.emails.map(email => {
            return (
            <Email 
            detail="false"
            key={email.email_id} 
            id={email.email_id}
            firstName={email.firstName}
            lastName={email.lastName}
            date={email.date}
            subject={email.subject}
            read={email.read}
            address={email.address}
            showEmail={this.props.showEmail}
            toggleAlert={this.props.toggleAlert}
            audio={this.props.audio}
            />
            )
        });

        return(
            <div id="email-list" className={this.props.state.showEmail? "hidden" : ""}>{emails}</div>
        )
    }
}

export default EmailList;