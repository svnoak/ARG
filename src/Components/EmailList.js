import React from 'react';
import Email from "./Email";

class EmailList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.addEmail();
        }, 2000);
      }

    addEmail(){
        const request = new Request('https://dev.svnoak.net/api/email/1')
        fetch(request)
        .then(response => response.json())
        .then(data => {
            this.state.data.unshift(data[0]);
            const newList = this.state.data;
            console.log(newList);
            this.setState({data: newList});
            });
    }

    render(){
        const emails = this.state.data.map(email => {
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
            />
            )
        });

        return(
            <div id="email-list">{emails}</div>
        )
    }
}

export default EmailList;