const mongoose = require('mongoose')

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    otpvalue:{
        type:Number,
    },
    expireat:{
        type: Date
    }

})

const OTP = mongoose.model('OTP', OTPSchema)

module.exports = OTP