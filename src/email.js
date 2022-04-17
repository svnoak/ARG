class EmailList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        const request = new Request('https://dev.svnoak.net/api/email/')
        fetch(request)
        .then(response => response.json())
        .then(data => {
            data = data.slice(1) 
            this.setState({ data});
            });

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

class Email extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            read: props.read == 1 ? true : false,
        }
        this.showEmail = this.showEmail.bind(this);
    }

    markRead(){
        if( !this.state.read ) this.setState({read: true});
    }

    showEmail(){
        this.markRead();
        const id = this.props.id;
    }

    render() {
        moment.locale('sv');
        const date = new Date();
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