import React from "react";
import Nav from "./Components/Nav";
import EmailList from "./Components/EmailList";
import Slide from "./Components/Slide";
import Login from "./Components/Login";
import Alert from "./Components/Alert";
import "./assets/css/style.css"

class App extends React.Component {
  constructor(props){
    super(props)
    this.audio = new Audio('https://proxy.notificationsounds.com/notification-sounds/definite-555/download/file-sounds-1085-definite.mp3');
    this.showEmail = this.showEmail.bind(this);
    this.state = {
      emails: [],
      emailId: null,
      showEmail: false,
      loggedIn: false,
      name: "",
      showAlert: false
    }
  }

  componentDidMount() {
    const userData = JSON.parse(localStorage.getItem("arg_user"));
      if( userData ){
        this.setState({ name: userData.name, loggedIn: true });
      }
    const request = new Request('https://dev.svnoak.net/api/email/')
    fetch(request)
    .then(response => response.json())
    .then(data => {
        /* data.forEach(element => {
          const newBody = element.body.replace("{username}", this.state.name);
          element.body = newBody
        }); */
        this.setState({emails: data}, () => { if( localStorage.getItem("arg_readEmail") === "true" ) this.showEmail(1)});
      });
  }

  showEmail = (id) => {
    if( id === 1 ) localStorage.setItem("arg_readEmail", "true");
    this.setState({emailId: id-1, showEmail: true})
  }

  closeEmail = (state) => {
    this.setState({showEmail: false});
  }

  loginUser = (userData) =>{
    const name = userData.name;
    this.setState({name: name, loggedIn: true});
    const stringifiedData = JSON.stringify(userData);
    localStorage.setItem("arg_user", stringifiedData );
  }

  toggleAlert = (state) => {
    this.setState({ showAlert: state })
  }

  render(){
    return (
      <>
      { !this.state.loggedIn && <Login loginUser={this.loginUser}/> }
      { this.state.loggedIn && 
        <>
        <Nav backBtn={this.state.showEmail} closeEmail={this.closeEmail}/>
        <EmailList showEmail={this.showEmail} state={this.state} wait="1" toggleAlert={this.toggleAlert} audio={this.audio}/>
        { this.state.showEmail && <Slide data={this.state.emails[this.state.emailId]} name={this.state.name}/> }
        </>
      }
      { (this.state.showAlert && this.state.showEmail) && <Alert /> }
      </>
    )
  }
}

export default App;
