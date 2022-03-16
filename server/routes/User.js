const express = require('express')
const User = require('../models/User')
const router = new express.Router()

router.post('/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch(e){
        console.log("errorroror")
        res.status(400).send()
    }
});

router.get('/about',(req,res)=>{
    res.send("Login user");
});

module.exports = router;

