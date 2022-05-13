import React, { useState } from 'react';

function Login(props){
    const accessCode = Math.floor(100000 + Math.random() * 900000);
    const [failure, setFailure] = useState(false);


    async function createUser(props){
        let username = document.getElementById("name").value;
        const request = new Request(`https://dev.svnoak.net/api/user/create/`);
        const data = {
            username: username,
            password: accessCode
        }

        const response = await fetch(request ,
            {  
                method: 'POST',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)  
            });

        if( response.status === 201 ){
            const userData = await response.json()
            props.loginUser(userData);
        } else {
            setFailure(true);
        }
    }

    return(
        <div className='login-background'>
            <div className="login">
                <h1>Inbox</h1>
                <form>
                    <label htmlFor="name">Ditt användarnamn</label>
                    <input type="text" id="name"></input>
                    { failure && <p>Användarnamnet finns redan</p> }
                </form>
                <p className="code">{accessCode}</p>
                <p className="info">Skriv ner användarnamn och tillgångskod!</p>

                <button onClick={() => createUser(props)}>Skapa användare</button>
            </div>
        </div>
    )
}

export default Login;