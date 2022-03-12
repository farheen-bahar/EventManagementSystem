import React, { Component } from 'react'

class Login extends Component{
    constructor(){
        super()
        
    }
    render(){
        console.log(this.props)
        return (
            <form onSubmit={this.props.onFormSubmit}>
                    <label htmlFor="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter username" name="uname" required 
                                       onChange={this.props.onEmailChange}
                                       />

                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter password" name="psw" required
                           onChange={this.props.onPwdChange}/>

                    <button type="submit" className='btn-login'>Login</button>
                    <p className='forgot-pwd'>Forgot password?</p>
            </form>
        )
    }
}

export default Login