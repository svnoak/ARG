function Login(props){
    const accessCode = Math.floor(100000 + Math.random() * 900000);
    
    function login(props){
        let username = document.getElementById("name").value;
/*        fetch( new Request("https://dev.svnoak.net/api/user"),{
            method: "POST",
            body: {
                "name": username,
                "password": accessCode
            }
        } ) */
        props.login(username);
    }

    return(
        <div className="login">
            <p>Vad ska vi kalla dig?</p>
            <form>
                <input type="text" id="name"></input>
            </form>
            <p>{accessCode}</p>

            <button onClick={() => login(props)}>Login</button>
        </div>
    )
}

export default Login;