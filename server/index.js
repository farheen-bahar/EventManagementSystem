var express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const otproutes =  require('./routes/OTP')
const userloginroutes = require('./routes/User')

const app = express()
app.use(express.json())
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())


// begin mongoose setup

//const CONNECTION_URL = 'mongodb+srv://feedbacktracker:feedbacktracker123@mern.if1a7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const CONNECTION_URL = "mongodb+srv://event_management:event_management@cluster0.tcr4k.mongodb.net/Cluster0?retryWrites=true&w=majority";

const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>
    app.listen(PORT, ()=> console.log(`server running on port ${PORT}`))
)
.catch(err=>
    console.log(err)
)

const db = mongoose.connection
db.once('open', _=>{
    console.log("Datatbase Connection Complete", CONNECTION_URL)
})

db.on("error", err=>{
    console.log("Connection error", err)
})
// end setup

app.use('/api',otproutes);
app.use('/user',userloginroutes)


app.get('/', function (req, res) {
    console.log('route / is accessed.');
    res.send('Hi');
  });

