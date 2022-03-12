var express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(cors())

const CONNECTION_URL = 'mongodb+srv://feedbacktracker:feedbacktracker123@mern.if1a7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>
    app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))
)
.catch(err=>
    console.log(err)
)
