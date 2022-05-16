import { React, useState } from "react";
import "./assets/css/login.css"

function Login(props) {
    
    const [fail, setFail] = useState(false);

    async function checkLogin(){
        const request = new Request(`https://dev.svnoak.net/api/user/login/`);
        const data = {
            username: document.querySelector("#loginUsername").value,
            password: document.querySelector("#loginCode").value
        }
    
        const response = await fetch(request ,{
                method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        
        if( response.status === 200 ){
            const responseData = await response.json();
            const userData = {
                username: responseData.name,
                id: responseData.id
            }
            props.loginHandler(userData);
        } else {
            setFail(true);
        }
        }

    return(
        <div className="login-form">
            <span className="title">V.A.R.G</span>
            { fail && <div className="error">Fel användarnamn eller kod</div> }
            <input id="loginUsername" placeholder="Användarnamn"></input>
            <input id="loginCode" placeholder="Tillgångskod" type="number" pattern="[0-9]*" inputMode="numeric"></input>
            <button onClick={ () => checkLogin() }>Logga in</button>
        </div>
    )
}

export default Login;