import React from "react";
import moment from 'moment';
import "../css/style.css"

class Slide extends React.Component{
    render() {
        const data = this.props.data;
        console.log(data.time);
        moment.locale('sv');
        let day = parseInt(data.date) < 0
        ? moment().add(data.date, 'days').format("Do MMMM")
        : data.date;
        return (
            <div className={`email email-detail`} id={data.id} >
                <ReadIndicator read={true} />
                <Avatar shortName={data.firstName} />
                <EmailContent day={day} time={data.time} data={data}/>
            </div>
        )
    }
}

function EmailContent(props){
    return(
        <div className="email-content">
            <div className="email-heading">
                <h2>{props.data.firstName} {props.data.lastName}</h2>
                <EmailDate date={props.day} time={props.time} />
            </div>
            <div className="email-body">
                <h3 dangerouslySetInnerHTML={{__html: `${props.data.subject}`}}></h3>
            </div>
            <Addresses address={props.data.address} />
            <EmailText body={props.data.body} />
        </div>
    )
}

function Avatar(props){
    console.log(props);
    const shortName = props.shortName.charAt(0).toUpperCase();
    const color = 'black' /* Math.floor(Math.random()*16777215).toString(16); */

    return(
        <div className="avatar" style={{backgroundColor: '#' + color}}>
            <span>{shortName}</span>
        </div>
    )
}

function ReadIndicator(props){
    return <div className="read-indicator" style={{backgroundColor: 'white' }}></div>
}

function EmailDate(props){
    const time = props.time.slice(0,5);
    return <p>{props.date} {time}</p>;
}

function Addresses(props){
    return(
        <div className="adresses">
            <p>Från: {props.address}</p>
            <p>Till: namn@redaktionen.se</p>
        </div>
    )
}

function EmailText(props){
    return(
        <div className="email-text" dangerouslySetInnerHTML={{__html: `${props.body}`}}>
        </div>
    )
}

export default Slide;