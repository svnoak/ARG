import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './style.css'

class Email extends Component {
  render() {
    return (
        <div class="email" id="email-1">
            <div class="avatar">
                <span>A</span>
            </div>
            <div class="email-content">
                <div class="email-heading">
                <h2>Anonymous</h2>
                <p>Nu</p>
                </div>
                <div class="email-body">
                    <h3>Jag vet</h3>
                </div>
            </div>
        </div>
    )
  }
}

ReactDOM.render(<Email />, document.getElementById('root'))