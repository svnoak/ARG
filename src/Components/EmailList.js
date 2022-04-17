import React from "react";
import Email from "./Email";

class EmailList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            batch: [],
            anon: {},
            all: []
        }
    }

    componentDidMount() {
        if( this.state.batch.length === 0 ){
            const request = new Request('https://dev.svnoak.net/api/email/')
            fetch(request)
            .then(response => response.json())
            .then(data => {
                this.setState({all:data, batch:data.slice(1), anon: data[0]})
            });
        }
        setTimeout(() => {
            if( this.state.batch.length !== this.state.all.length )
            this.addEmail();
        }, 2000);
      }

    addEmail(){
        this.state.batch.unshift(this.state.anon);
        this.setState({batch: this.state.batch});
    }

    render(){
        const emails = this.state.batch.map(email => {
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