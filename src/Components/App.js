import React from "react";
import Nav from "./Nav";
import EmailList from "./EmailList";
import Slide from "./Slide";

class App extends React.Component {
  constructor(props){
    super(props)
    this.showEmail = this.showEmail.bind(this);
    this.state = {
      emails: [],
      emailId: null,
      showEmail: false
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

  render(){
    return (
      <>
        <Nav backBtn={this.state.showEmail} closeEmail={this.closeEmail}/>
        <EmailList showEmail={this.showEmail} data={this.state.emails} wait="1" />
        { this.state.showEmail && <Slide data={this.state.emails[this.state.emailId]} /> }
      </>
    )
  }
}

export default App;
