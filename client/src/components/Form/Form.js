import React, { Component } from "react";
import { Navigate } from "react-router";
import Login from "./Login";
import SignUp from "./SignUp";
import Notification from "../Notifications/Notification";
import ForgotPwd from "./ForgotPwd";
import axios from "axios";

const ERRORS = {
  EMAIL: "Invalid Email ID.",
  PASSWORD:
    "Password should be at least 6 to 12 characters along with an uppercase, a lowercase and a special character '#?!@$%^&*-_'.",
  CONFIRM_PASSWORD: "Passowrd and confirm password does not match.",
  GENERIC_FAILED: "Oops! Something went wrong. Please try again.",
  LOGIN_FAILED: "Authentication failed!",
  OTP_EXPIRED: "OTP Expired",
  USER_VERIFY_FAILED: "User verification failed!",
  OTP_REQUIRED: "OTP is required!",
  USER_ALREADY_EXISTS: "User already exists!",
  USER_REGISTRATION_FAILED: "User registration failed!",
};
const NOTIFICATIONS = {
  SIGNUP_SUCCESS: "Successfully Registered!",
  OTP_SENT: "OTP sent to the registered email!",
  PWD_RESET_SUCCESS: "Password reset successful!",
};
class Form extends Component {
  constructor() {
    super();
    this.state = {
      isLogin: true,
      isForgotPwd: false,
      isUserVerified: false,
      firstname: "",
      lastname: "",
      otp: {
        value: "",
        expiresat: new Date(),
        display: "",
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
        isConfirm: false,
      },
      user: null,
      errorMessages: [],
      notifications: [],
    };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPwdChange = this.onPwdChange.bind(this);
    this.onConfirmPwd = this.onConfirmPwd.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onForgotPwdSubmit = this.onForgotPwdSubmit.bind(this);
    this.onFNChange = this.onFNChange.bind(this);
    this.onLNChange = this.onLNChange.bind(this);
    this.onCloseNotification = this.onCloseNotification.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
    this.onSendOTPSubmit = this.onSendOTPSubmit.bind(this);
    this.onVerifyOTPSubmit = this.onVerifyOTPSubmit.bind(this);
    this.onOTPChange = this.onOTPChange.bind(this);
    this.onForgotPwdClick = this.onForgotPwdClick.bind(this);
  }
  validateEmail(value) {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var email = value;
    return pattern.test(email) ? true : false;
  }
  onEmailChange(event) {
    let email = event.target.value;
    let isValidEmail = this.validateEmail(email);
    if (!isValidEmail) {
      console.log("Failed");
      this.setState({
        ...this.state,
        email: { value: "", isValid: false },
        errorMessages: [],
      });
    } else {
      console.log("Success");
      this.setState({
        ...this.state,
        email: { value: email, isValid: true },
        errorMessages: [],
      });
    }
  }
  onPwdChange(event) {
    var pwd = event.target.value;
    var pattern = new RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{6,12}$/
    );
    // ^ represents the starting of the string.
    // (?=.*[a-z]) represent at least one lowercase character.
    // (?=.*[A-Z]) represents at least one uppercase character.
    // (?=.*\\d) represents at least one numeric value.
    // (?=.*[-+_!@#$%^&*., ?]) represents at least one special character.
    // . represents any character except line break.
    // + represents one or more times.
    if (!this.state.isLogin) {
      //test for password length & matching pattern only in case of registration
      if (pwd.length >= 6 && pwd.length <= 12) {
        if (!pattern.test(pwd)) {
          console.log("Failed pattern");
          this.setState({
            ...this.state,
            password: { value: "", isValid: false },
          });
        } else {
          console.log("Success");
          this.setState({
            ...this.state,
            password: { value: pwd, isValid: true },
          });
        }
      } else {
        console.log("Failed length");
        this.setState({
          ...this.state,
          password: { value: "", isValid: false },
        });
      }
    } else {
      //accept user input without any validation for login since we verify it from DB
      this.setState({ ...this.state, password: { value: pwd, isValid: true } });
    }
  }
  onConfirmPwd(event) {
    var confirmPwd = event.target.value;
    var pwd = this.state.password;
    if (pwd.isValid && confirmPwd === pwd.value) {
      this.setState({
        ...this.state,
        password: { ...this.state.password, isConfirm: true },
        errorMessages: [],
      });
    } else {
      this.setState({
        ...this.state,
        password: {
          ...this.state.password,
          isConfirm: false,
          errorMessages: [],
        },
      });
    }
  }
  onTabClick(value) {
    //reset whole state on switching tabs
    this.setState({
      isLogin: value,
      isForgotPwd: false,
      firstname: "",
      lastname: "",
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
      user: null,
    });
  }
  onFNChange(event) {
    var FN = event.target.value;
    if (FN.length >= 3) this.setState({ ...this.state, firstname: FN });
  }
  onLNChange(event) {
    var LN = event.target.value;
    if (LN.length >= 3) this.setState({ ...this.state, lastname: LN });
  }
  onSendOTPSubmit() {
    //FORGOT PASSWORD
    var { email, otp } = this.state;
    var errorMessages = [],
      notifications = [];
    if (!email.isValid) errorMessages.push(ERRORS.EMAIL);
    if (errorMessages.length === 0) {
      /*
                    API-validate user email exists or not
                    Success: Get OTP as response from above API. 
                             API will send status code 200 and OTP expiry time to the input email
                             Display textbox to enter OTP
                             Display notification with msg "OTP sent to email!"
                             set expiresat property with the value from API 
                             
                    Failure: Display 'Invalid email ID' notification
                */
      //Assuming success:
      axios
        .get(`/api/otp/${email.value}`)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            notifications.push(NOTIFICATIONS.OTP_SENT);
            this.setState({
              ...this.state,
              notifications,
              otp: { ...otp, display: true, expiresat: res.data.expireat },
            });
          } else {
            errorMessages.push(ERRORS.EMAIL);
            this.setState({
              ...this.state,
              otp: { ...this.state.otp, display: false },
            });
          }
        })
        .catch((err) => {
          errorMessages.push(ERRORS.GENERIC_FAILED);
          this.setState({ ...this.state, errorMessages });
        });
    } else {
      this.setState({ ...this.state, errorMessages });
    }
  }
  onVerifyOTPSubmit() {
    let { otp, email } = this.state;
    let now = new Date();
    var errorMessages = [];

    if (otp.value.trim().length === 0) {
      //OTP is required
      errorMessages.push(ERRORS.OTP_REQUIRED);
      this.setState({ ...this.state, errorMessages, isUserVerified: false });
    }
    //check if OTP is expired
    else if (now < new Date(otp.expiresat)) {
      /*
                API: send otp, email to validte
                Success: User is verifed.
                         Display password and confirm password fields to allow user to set new passsword
                Failure: display  "User verification Failed" notification 
                Error: display "Oops! Something went wrong. Please try again." notification
            */

      var data = JSON.stringify({
        email: email.value,
        otp: otp.value,
      });
      axios
        .post("/api/otp", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            //Success:
            this.setState({ ...this.state, isUserVerified: true });
          } else {
            //Failure
            errorMessages.push(ERRORS.USER_VERIFY_FAILED);
            this.setState({
              ...this.state,
              errorMessages,
              isUserVerified: false,
            });
          }
        })
        .catch((err) => {
          //Error
          errorMessages.push(ERRORS.GENERIC_FAILED);
          this.setState({
            ...this.state,
            errorMessages,
            isUserVerified: false,
          });
        });
    } else {
      /* 
                OTP Expired - display error notification
            */
      errorMessages.push(ERRORS.OTP_EXPIRED);
      this.setState({ ...this.state, errorMessages });
    }
  }
  onOTPChange(event) {
    this.setState({
      ...this.state,
      otp: { ...this.state.otp, value: event.target.value },
    });
  }
  onFormSubmit(event) {
    event.preventDefault();
    var { firstname, lastname, email, password } = this.state;
    var errorMessages = [];
    var notifications = [];
    if (!email.isValid) errorMessages.push(ERRORS.EMAIL);
    if (!password.isValid) errorMessages.push(ERRORS.PASSWORD);
    if (this.state.isLogin) {
      //LOGIN
      if (errorMessages.length === 0) {
        //API-validate user info
        //Success: Navigate to home page
        //Assuming success:
        this.setState({ ...this.state, user: { name: "Anuja" } });
        //Failure: Display 'Authentication failed!' notification
      } else {
        this.setState({ ...this.state, errorMessages });
      }
    } else {
      //REGISTER
      if (!password.isConfirm) errorMessages.push(ERRORS.CONFIRM_PASSWORD);
      if (errorMessages.length === 0) {
        //API- save user info
        //Success: Display notification 'Successfully Registered!'
        //         Make login tab active for the user to login
        //Failure: Oops! Something went wrong. Please try again.

        //TODO: Assuming success
        var data = JSON.stringify({
          fname: firstname,
          lname: lastname,
          email: email.value,
          password: password.value,
        });
        axios
          .post("/api/v1/auth/signup", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              //Success:
              notifications.push(NOTIFICATIONS.SIGNUP_SUCCESS);
              this.setState({ ...this.state, notifications, isLogin: true });
            } else {
              //Failure
              errorMessages.push(ERRORS.USER_REGISTRATION_FAILED);
              this.setState({
                ...this.state,
                errorMessages,
              });
            }
          })
          .catch((err) => {
            //Error
            errorMessages.push(ERRORS.USER_ALREADY_EXISTS);
            this.setState({
              ...this.state,
              errorMessages,
            });
          });
      } else {
        this.setState({ ...this.state, errorMessages });
      }
    }
  }
  onCloseNotification(id, isError) {
    var { errorMessages, notifications } = this.state;
    if (isError) {
      errorMessages = errorMessages.filter((err, index) => index !== id);
      this.setState({ ...this.state, errorMessages });
    } else {
      notifications = notifications.filter(
        (notification, index) => index !== id
      );
      this.setState({ ...this.state, notifications });
    }
  }
  onForgotPwdClick(value) {
    this.setState({
      isLogin: false,
      isForgotPwd: value,
      firstname: "",
      lastname: "",
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
      user: null,
    });
  }
  onForgotPwdSubmit(event) {
    event.preventDefault();
    var { email, password } = this.state;
    var errorMessages = [],
      notifications = [];
    if (!password.isValid) errorMessages.push(ERRORS.PASSWORD);
    if (!password.isConfirm) errorMessages.push(ERRORS.CONFIRM_PASSWORD);
    if (errorMessages.length === 0) {
      /**
       * API: Send email and password to Users schema
       *      update password for the record with this email
       *      SUCCESS: API will send status 200
       *               display 'Password updated successfully!'
       *      FAILURE/ERROR: display "Oops! Something went wrong. Please try again."
       */
      try {
        //TODO: call API and update password
        //Assuming Success - switch to login tab
        notifications.push(NOTIFICATIONS.PWD_RESET_SUCCESS);
        this.setState({
          ...this.state,
          notifications,
          isLogin: true,
          isForgotPwd: false,
        });
      } catch {
        errorMessages.push(ERRORS.GENERIC_FAILED);
        this.setState({ ...this.state, errorMessages });
      }
    } else {
      this.setState({ ...this.state, errorMessages });
    }
  }
  componentDidMount() {
    //If the user already logged in (user name is available) - redirect to home
    //Stay in login page if the user is not authenticated (user name is not available)
  }
  displayNotification(isError) {
    let { errorMessages, notifications } = this.state;
    var obj = isError ? errorMessages : notifications;
    return (
      <div className="notifications">
        {obj.map((item, index) => {
          return (
            <Notification
              key={index}
              isError={isError}
              id={index}
              message={item}
              onClose={this.onCloseNotification}
            />
          );
        })}
      </div>
    );
  }
  render() {
    var {
      errorMessages,
      notifications,
      user,
      isLogin,
      isForgotPwd,
      otp,
      isUserVerified,
    } = this.state;
    return (
      <div>
        {user && <Navigate to="/home" replace={true} />}
        {errorMessages.length && this.displayNotification(true)}
        {notifications.length && this.displayNotification(false)}
        {/* <div className='notifications'>      
                    {errorMessages.map((error,index)=>{
                       return  <Notification key={index} 
                                             isError={true}
                                             id={index}
                                             message={error}
                                             onClose={this.onCloseNotification}/>
                    })}
                </div> :''       
                } */}
        <div className="form">
          <div className="form-header">
            {isForgotPwd ? (
              <label className="tab-active acc-recovery">
                ACCOUNT RECOVERY
              </label>
            ) : (
              <>
                <label
                  className={isLogin ? "tab-active" : ""}
                  onClick={() => this.onTabClick(true)}
                >
                  LOGIN
                </label>
                <label
                  className={!isLogin ? "tab-active" : ""}
                  onClick={() => this.onTabClick(false)}
                >
                  REGISTER
                </label>
              </>
            )}
          </div>
          <div className="form-body">
            {isForgotPwd ? (
              <ForgotPwd
                onForgotPwdSubmit={this.onForgotPwdSubmit}
                onEmailChange={this.onEmailChange}
                onOTPChange={this.onOTPChange}
                onPwdChange={this.onPwdChange}
                onConfirmPwd={this.onConfirmPwd}
                onSendOTPSubmit={this.onSendOTPSubmit}
                onVerifyOTPSubmit={this.onVerifyOTPSubmit}
                displayOtp={otp.display}
                isUserVerified={isUserVerified}
              />
            ) : isLogin ? (
              <Login
                onEmailChange={this.onEmailChange}
                onPwdChange={this.onPwdChange}
                onFormSubmit={this.onFormSubmit}
                onForgotPwdClick={this.onForgotPwdClick}
              />
            ) : (
              <SignUp
                onEmailChange={this.onEmailChange}
                onPwdChange={this.onPwdChange}
                onFNChange={this.onFNChange}
                onLNChange={this.onLNChange}
                onConfirmPwd={this.onConfirmPwd}
                onFormSubmit={this.onFormSubmit}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
