const { Auth } = require("two-step-auth");
const OTP = require('../models/OTP')

const RESPONSE_MSGS = {
  ERROR_500: {CODE: 0, MSG: "Internal Server Error"},
  OTP_FAILED: {CODE: 1, MSG: "Oops! Something went wrong. Please try again."},
  EMAIL_NOT_FOUND: {CODE: 2, MSG: "Email not found"},
  INVALID_USER: {CODE: 3, MSG: "Invalid User!"}
}
  
const getotp = async (req, res) => {
  try {
    const email = req.params.email
    /*
       Check if email id exists in users DB
            if yes, user is authentic => generate otp
                                      => save in OTP collection
                                         -if email exists update the otp and createdat values
                                         -if not, create a new json with otp, email, and created at
                                      => send expiry date back to client
            if no, user is not authentic => send error message to client
    */
    //TODO: Assuming user is authentic

    //two-step-auth will generate OTP and sends OTP to the user email
    const response = await Auth(email, "Event Management System");
    if(response.success){
      const existingEmail = await OTP.findOne({email:email})
      let expireAfterMin = 10
      let now = new Date();
      let expireat = new Date(now.getTime() + expireAfterMin*60000);

      if(!existingEmail){
        const otpObj = {email: email, otpvalue: response.OTP, expireat: expireat}
        const result= new OTP({...otpObj})
        await result.save()
      }
      else{
        await OTP.updateOne({_id:existingEmail._id},{otpvalue: response.OTP, expireat: expireat})
      }
      res.status(200).json({email, expireat})
    }
    else{
      res.status(500).json({error: error.message, message: RESPONSE_MSGS.OTP_FAILED})
    }
  } catch (error) {
    res.status(500).json({error: error.message, message: RESPONSE_MSGS.ERROR_500})
  }
}
 
const verifyotp = async (req,res) => {
  try{
    const otp=req.body.otp
    const email=req.body.email
    /*
      get the record with email specified in the body
      compare otp from body with otp from the rcord
      match => user is verified => send 200OK 
    */
    const existingEmail = await OTP.findOne({email:email})
    if(existingEmail)
    {
      if(existingEmail.otpvalue === +otp && existingEmail.expireat >= new Date())
      res.status(200).send(true)
      else
      res.status(500).json(RESPONSE_MSGS.INVALID_USER)
    }
    else{
      res.status(404).json(RESPONSE_MSGS.EMAIL_NOT_FOUND)
    }
  }
  catch(error){
    res.status(500).json(RESPONSE_MSGS.ERROR_500)
  }

}
module.exports={getotp, verifyotp}