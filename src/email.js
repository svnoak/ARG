class Email extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return( 
            <div className="email" id={this.props.id}>
                <Avatar shortName={this.props.sender}/>
                <div className="email-content">
                    <div className="email-heading">
                        <h2>{this.props.sender}</h2>
                        <EmailDate date={this.props.date}/>
                    </div>
                    <div className="email-body">
                        <h3>{this.props.subject}</h3>
                    </div>
                </div>
            </div>
        )
    }
}

class Avatar extends Email{
    constructor(props) {
        super(props);
        this.state = {
            shortName: props.shortName.charAt(0).toUpperCase(),
            color: Math.floor(Math.random()*16777215).toString(16)
        }
    }
    render(){
        return(
            <div className="avatar" style={{backgroundColor: '#' + this.state.color}}>
                <span>{this.state.shortName}</span>
            </div>
        )
    }
}

function EmailDate(props){
    return <p>{props.date}</p>;
}

class EmailList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mailElements: [],
            mailContents: [
                {
                    "id": "2",
                    "sender": "Thomas Hallon",
                    "address": "thomas-hallon@redaktionen.se",
                    "subject": "Mötet imorgon",
                    "date": "Igår",
                    "time": "15:43",
                    "body": ""
                },
                {
                    "id": "3",
                    "sender": "Fredrik Söderberg",
                    "subject": "Vem skulle fixa fikat?",
                    "date": "Igår",
                    "time": "12:16",
                    "body": ""
                }
            ]
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.addEmail();
        }, 2000);
      }

    addEmail(){
        this.state.mailContents.unshift(
            {
                "id": "1",
                "sender": "Anonymous",
                "subject": "Jag vet",
                "date": "7e April",
                "time": "11:05",
                "body": ""
            })
        const newList = this.state.mailContents;
        console.log(newList);
        this.setState({mailContents: newList});
        console.log(this.state.mailContents);
    }

    render(){
        this.state.mailElements = this.state.mailContents.map(email => {
            return <Email key={email.id} id={email.id} sender={email.sender} date={email.date} subject={email.subject}/>
        });

        return(
            <div id="email-list">{this.state.mailElements}</div>
        )
    }
}

ReactDOM.render(
    <EmailList />,
    document.getElementById("main")
    );