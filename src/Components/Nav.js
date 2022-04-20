function Nav(props){
    return (
        <nav>
            { props.backBtn && <div onClick={props.closeEmail}>Tillbaka</div>}
            <h1>Email Inbox</h1>
        </nav>
    )
}

export default Nav;