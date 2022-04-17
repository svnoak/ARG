class EmailList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            mailElements: [],
            data: []
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:3000/api/email')
        .then(response => response.json())
        .then(data => {
            this.setState({ data })
            
        });

        

        setTimeout(() => {
            this.addEmail();
        }, 2000);
      }

    addEmail(){
        this.state.data.unshift(
            {
                "id": 1,
                "sender": {"firstName": "Anonymous", "lastName": ""},
                "address": "",
                "subject": "Jag vet",
                "date": "7e April",
                "time": "11:05",
                "body": "",
                "read": "false"
            })
        const newList = this.state.data;
        this.setState({data: newList});
    }

    render(){
        const emails = this.state.data.map(email => {
            return (
            <Email 
            detail="false"
            key={email.id} 
            id={email.id} 
            sender={email.sender} 
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

class Email extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            read: false
        }
        this.showEmail = this.showEmail.bind(this);
    }

    markRead(){
        if( !this.state.read ) this.setState({read: true});
    }

    showEmail(){
        this.markRead();
        const id = this.props.id;
        console.log(id);
    }

    render() {
        const email = (
            <div className={`email ${this.state.read ? "":"unread"}`} id={this.props.id}  onClick={this.showEmail}>
                <ReadIndicator read={this.state.read} />
                <Avatar shortName={this.props.sender.firstName} />
                <div className="email-content">
                    <div className="email-heading">
                        <h2>{this.props.sender.firstName} {this.props.sender.lastName}</h2>
                        <EmailDate date={this.props.date} />
                    </div>
                    <div className="email-body">
                        <h3>{this.props.subject}</h3>
                    </div>
                    {this.props.detail == "true" &&
                        <div>
                        <Addresses address={this.props.address} />

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

class Avatar extends React.Component{
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

class ReadIndicator extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return <div className="read-indicator" style={{backgroundColor: this.props.read ? "lightgray" : "blue"  }}></div>
    }
}

function EmailDate(props){
    return <p>{props.date}</p>;
}

class Addresses extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="adresses">
                <p>Från: {this.props.address}</p>
                <p>Till: namn@redaktionen.se</p>
            </div>
        )
    }
}

class EmailText extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="email-text">
                <p>Namn</p>
                <p>
                    Ingen verkar förstå vad som sker.
                    Barnen kan se, de vet mycket er.
                </p>
                <p>
                    Vi glömmer när tiden går.
                    Är vi noga kan vi se.
                </p>
                <p>
                    Staden har många hemligheter som
                    verkar ha ett eget liv i sig.
                </p>
                <p>
                    Jag har varit i fara. Det behövs andra väga att kommunicera för att du ska förstå.
                </p>
                <a href="site.html">https://kommunicerasakert.se</a>
            </div>
        )
    }
}

ReactDOM.render(
    <EmailList />,
    document.getElementById("main")
);