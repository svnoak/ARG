import React from "react";
import Nav from "./Nav";
import EmailList from "./EmailList";
import Slide from "./Slide";
import Login from "./Login";
import Alert from "./Alert";
import "../assets/css/style.css"

class App extends React.Component {
  constructor(props){
    super(props)
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
    const request = new Request('https://dev.svnoak.net/api/email/')
    fetch(request)
    .then(response => response.json())
    .then(data => {
        this.setState({emails: data});
      });
  }

  showEmail = (id) => {
    this.setState({emailId: id-1, showEmail: true})
  }

  closeEmail = (state) => {
    this.setState({showEmail: false});
  }

  loginUser = (name) =>{
    this.setState({name: name, loggedIn: true});
  }

  toggleAlert = (state) => {
    this.setState({ showAlert: state })
  }

  render(){
    return (
      <>
      { !this.state.loggedIn && <Login login={this.loginUser}/> }
      { this.state.loggedIn && 
        <>
        <Nav backBtn={this.state.showEmail} closeEmail={this.closeEmail}/>
        <EmailList showEmail={this.showEmail} state={this.state} wait="1" toggleAlert={this.toggleAlert}/>
        { this.state.showEmail && <Slide data={this.state.emails[this.state.emailId]} name={this.state.name}/> }
        </>
      }
      { (this.state.showAlert && this.state.showEmail) && <Alert /> }
      </>
    )
  }
}

export default App;
