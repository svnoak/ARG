import React from "react";
import EmailList from "./EmailList";

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        data: []
    }
  }

  componentDidMount(){
    const request = new Request('https://dev.svnoak.net/api/email/')
        fetch(request)
        .then(response => response.json())
        .then(data => {
            data = data.slice(1) 
            this.setState({ data});
            });
  }
  
  render(){
    return (
      <div>
      <EmailList />
      </div>
    );
  }
}

export default App;
