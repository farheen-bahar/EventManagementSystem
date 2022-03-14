import React, { Component } from "react";

const CITIES=[
    {id: 1, name: 'Hyderabad'},
    {id: 2, name: 'Bangalore'},
    {id: 3, name: 'Delhi'},
    {id: 4, name: 'Mumbai'}
]

class AddEvent extends Component{
    constructor(){
        super()
        this.state={
            eventname:'',
            city:[],
            description:'',
            tags:["xyz","pqa"],
            slots:[],
            price:0,
        }
    }

    render(){
        //TODO: display only if user is authenticated
        return(
            <div className="addevent">
                <div>
                    <img src="assets/images/addevent.jpg"></img>
                </div>
                <form>
                    <div className="col-75">
                        <label htmlFor="eventname"><b>Event name</b></label>
                        <input type="text" placeholder="Enter event name" name="eventname" required/>
                    </div>
                    <div className="col-75">
                        <label htmlFor="city"><b>City</b></label>
                        <div>
                        <select>
                            <option value="0">Select city</option>
                            {CITIES.map(city=>{
                                return  <option value={city.id}>{city.name}</option>
                            })}
                        </select>
                    </div>
                    </div>

                    <div className="col-75">
                        <label htmlFor="desc"><b>Description</b></label>
                        <textarea name="desc" rows="4" cols="100" style={{resize:"none"}} maxLength={1000}></textarea>
                    </div>
                    <div  style={{marginBottom: "10px"}} className="col-75">
                        <label htmlFor="tags"><b>Tags</b></label>
                        <input type="text" placeholder="Enter tags" name="tags" required/>
                        <div className="event-tag">
                            {this.state.tags.map(tag=>{
                                return <p>{tag} <span>&times;</span></p>
                            })}
                        </div>
                    </div>

                    <label><b>Slots</b></label>
                    
                    <table>
                        <thead>
                            <td>Date</td>
                            <td>time (24 Hrs. format)</td>
                            <td>Tickets (VIP)</td>
                            <td>Tickets (GA)</td>
                        </thead>
                        <tbody>
                            <td><input type="date" name="date"></input></td>
                            <td><input type="text" name="time"></input></td>
                            <td><input type="number" name="vip" min={0}></input></td>
                            <td><input type="number" name="ga" min={0}></input></td>
                        </tbody>
                    </table>
                    
                    <label><b>Price</b></label>
                    <span>(INR)</span>
                    <input type="number" name="price" step=".01"></input>
                    <div className="btn-group">
                        <button type="submit" className='btn-login'>Save</button>
                        <button type="reset" className='btn-reset'>Reset</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddEvent