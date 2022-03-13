import React from "react";

const Notification = (props) => {
    const onCloseNotification =(id) =>{
        props.onClose(id)
    }
    return (
        <div className={props.isError ? "alert alert-error" : "alert alert-success"} id={props.id}>
            <span className="closebtn" onClick={(event)=>onCloseNotification(props.id, props.isError)}>&times;</span> 
            <strong>Error!</strong> {props.message}
        </div>
    )
}

export default Notification