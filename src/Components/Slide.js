import React from "react";
import moment from 'moment';

function Slide(props){
    moment.locale('sv');
    let day = parseInt(props.data.date) < 0
    ? moment().add(props.data.date, 'days').format("Do MMMM")
    : props.data.date;
    return (
        <div className={`email email-detail`} id={props.data.id} >
            <EmailContent day={day} time={props.data.time} data={props.data} name={props.name}/>
        </div>
    )
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
            <Addresses address={props.data.address} name={props.name}/>
            <EmailText body={props.data.body} />
        </div>
    )
}

function EmailDate(props){
    const time = props.time.slice(0,5);
    return <p>{props.date} {time}</p>;
}

function Addresses(props){
    return(
        <div className="adresses">
            <p>Från: {props.address}</p>
            <p>Till: {props.name}@redaktionen.se</p>
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