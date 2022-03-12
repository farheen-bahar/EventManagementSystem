import React, { Component } from 'react'
import {Navigate} from 'react-router'
import Login from './Login'
import SignUp from './SignUp'
import Notification from '../Notifications/Notification'

const ERRORS={
    EMAIL: "Invalid Email ID."
    ,PASSWORD:"Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character '#?!@$%^&*-_'."
    ,CONFIRM_PASSWORD:"Passowrd and confirm password does not match."
    ,SIGNUP_FAILED: "Oops! Something went wrong. Please try again."
    ,LOGIN_FAILED: "Authentication failed!"
    
}
const NOTIFICATIONS={
    SIGNUP_SUCCESS: "Successfully Registered!"
}
class Form extends Component{
    constructor(){
        super()
        this.state={
            isLogin: true,
            firstname:'',
            lastname:'',
            email:{
                value:'',
                isValid: false
            },
            password:{
                value:'',
                isValid: false,
                isConfirm: false
            },
            user:null,
            errorMessages:[],
            notifications: []
        }
        this.onEmailChange = this.onEmailChange.bind(this)
        this.onPwdChange = this.onPwdChange.bind(this)
        this.onConfirmPwd = this.onConfirmPwd.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onFNChange = this.onFNChange.bind(this)
        this.onLNChange = this.onLNChange.bind(this)
        this.onCloseNotification = this.onCloseNotification.bind(this)
        this.onTabClick=this.onTabClick.bind(this)
    }
    onEmailChange(event){
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        var email=event.target.value
        if (!pattern.test(email)) {
            console.log('Failed')
            this.setState({...this.state,email:{value:"",isValid:false,},errorMessages:[]})
        }
        else{
            console.log('Success')
            this.setState({...this.state,email:{value:email,isValid:true,},errorMessages:[]})
        }
    }
    onPwdChange(event){
        var pwd=event.target.value
        var pattern = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{6,12}$/);
        // ^ represents the starting of the string.
        // (?=.*[a-z]) represent at least one lowercase character.
        // (?=.*[A-Z]) represents at least one uppercase character.
        // (?=.*\\d) represents at least one numeric value.
        // (?=.*[-+_!@#$%^&*., ?]) represents at least one special character.
        // . represents any character except line break.
        // + represents one or more times.
        if(!this.state.isLogin){
            //test for password length & matching pattern only in case of registration
            if(pwd.length >= 6 && pwd.length <=12){
                if (!pattern.test(pwd)) {
                    console.log('Failed pattern')
                    this.setState({...this.state,password:{value:"",isValid:false,}})
                }
                else{
                    console.log('Success')
                    this.setState({...this.state,password:{value:pwd,isValid:true,}})
                }
            }
            else{
                console.log('Failed length')
                this.setState({...this.state,password:{value:"",isValid:false,}})
            }
        }
        else{
            //accept user input without any validation for login since we verify it from DB
            this.setState({...this.state,password:{value:pwd,isValid:true,}})
        }
    }
    onConfirmPwd(event){
        var confirmPwd= event.target.value
        var pwd = this.state.password
        if(pwd.isValid && confirmPwd === pwd.value)
        {
            this.setState({...this.state, password:{...this.state.password, isConfirm: true}, errorMessages:[]})
        }
        else{
            this.setState({...this.state, password:{...this.state.password, isConfirm: false, errorMessages:[]}})
        }
       
    }
    onTabClick(value){
        this.setState({isLogin:value, firstname:'', lastname:'',email:{value:'',isValid:false}, password:{value:'',isValid:false}})
    }
    onFNChange(event){
        var FN= event.target.value
        if(FN.length>=3)
        this.setState({...this.state,firstname:FN})
    }
    onLNChange(event){
        var LN= event.target.value
        if(LN.length>=3)
        this.setState({...this.state,lastname:LN})
    }
    onFormSubmit(event){
        event.preventDefault();
        var {email, password}= this.state
        var errorMessages=[]
        var notifications=[]
        if(!email.isValid)  errorMessages.push(ERRORS.EMAIL)
        if(!password.isValid) errorMessages.push(ERRORS.PASSWORD)
        if(this.state.isLogin)
        {
            //LOGIN
            if(errorMessages.length === 0){
                //API-validate user info
                //Success: Navigate to home page
                //Assuming success:
                this.setState({...this.state, user: {name:'Anuja'}})
                //Failure: Display 'Authentication failed!' notification

            }
            else{
                this.setState({...this.state,errorMessages})
            }
        }
        else{
            //REGISTER
            if(!password.isConfirm) errorMessages.push(ERRORS.CONFIRM_PASSWORD)
            if(errorMessages.length === 0)
            {
                //API- save user info
                //Success: Display notification 'Successfully Registered!' 
                //         Make login tab active for the user to login
                //Failure: Oops! Something went wrong. Please try again. 
            }
            else{
                this.setState({...this.state,errorMessages})
            }
        }
    }
    onCloseNotification(id){
        var errorMessages = this.state.errorMessages;
        errorMessages =errorMessages.filter((err,index)=> index!==id)
        this.setState({...this.state, errorMessages})
        //document.getElementById(id).style.display='none';
    }
    componentDidMount(){
        //If the user already logged in (user name is available) - redirect to home
        //Stay in login page if the user is not authenticated (user name is not available)
    }
    render(){
        var {errorMessages,user} = this.state
        return (
            <div>
                {user && (<Navigate to="/home" replace={true}/>)}
                {errorMessages.length ?   
                <div className='notifications'>      
                    {errorMessages.map((error,index)=>{
                       return  <Notification key={index} 
                                             isError={true}
                                             id={index}
                                             message={error}
                                             onClose={this.onCloseNotification}/>
                    })}
                </div> :''       
                }
                <div className="form">
                    <div className='form-header'>
                        <label className={this.state.isLogin ? 'tab-active':''} 
                            onClick={()=>this.onTabClick(true)}>LOGIN</label>
                        <label className={!this.state.isLogin ? 'tab-active':''}
                            onClick={()=>this.onTabClick(false)} >REGISTER</label>
                    </div>
                    <div className='form-body'> 
                        {this.state.isLogin 
                        ?<Login onEmailChange={this.onEmailChange}
                                onPwdChange={this.onPwdChange}
                                onFormSubmit = {this.onFormSubmit}/>
                        :<SignUp onEmailChange={this.onEmailChange}
                                onPwdChange={this.onPwdChange}
                                onFNChange={this.onFNChange}
                                onLNChange={this.onLNChange}
                                onConfirmPwd={this.onConfirmPwd}
                                onFormSubmit = {this.onFormSubmit}/>}
                    </div>
            </div>
        </div>
        )
    }
}

export default Form