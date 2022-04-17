import React from "react";
import Email from "./Email";

class EmailList extends React.Component{
    /* addEmail(){
        const request = new Request('https://dev.svnoak.net/api/email/1')
        fetch(request)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(this.props.data);
        });
      } */
    
    render(){
        const emails = this.props.data.map(email => {
            return(
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
                />
            )
        });
        return(
            <div id="email-list">{emails}</div>
        )
    }
        
    }

export default EmailList;