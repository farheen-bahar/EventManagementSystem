import React from 'react'
import { Link } from 'react-router-dom'
import { SessionConsumer } from '../SessionCookie/SessionCookie'

const Header = () =>{
    return (
        <nav className='navbar'>
            <div className='navbar-brand'>Event Management System</div>
            <SessionConsumer>
                {
                    context => {
                        let userctx= context.getUser()

                        console.log(userctx)
                        return (
                            <>
                            {
                                userctx.id 
                                ? <div className='navbar-user'>{userctx.firstname }</div>
                                : <div className='navbar-user'><Link to='/login'>Login</Link></div>
                            }
                            </>
                        )
                    }
                }
            </SessionConsumer>
        </nav>
    )
}

export default Header