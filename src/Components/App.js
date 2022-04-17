import React from "react";
import EmailList from "./EmailList";

class App extends React.Component {

  state = {
    data: []
  }

  componentDidMount(){
    fetch(new Request('https://dev.svnoak.net/api/email/'))
    .then(response => response.json())
    .then(data =>  {
      data = data.slice(1);
      this.setState({ data })
    })

      setTimeout(() => {
        this.addEmail();
      }, 2000);
  }

  addEmail(){
    fetch(new Request('https://dev.svnoak.net/api/email/1'))
    .then(response => response.json())
    .then(data => {
        this.state.data.unshift(data[0]);
        console.log(this.state.data);
    });
  }

  render(){
    return <EmailList data={this.state.data}/>;
  }
}

export default App;
