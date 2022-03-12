import React from "react";
import Event from "./Event";

const Events = (props) =>{
    console.log(props.events)
    return (
    <div> 
        <div className="events">
            
            {props.events.map(event=>{
                return <Event key={event.id} event={event}/>
            })}
        </div>
    </div>)
}

export default Events