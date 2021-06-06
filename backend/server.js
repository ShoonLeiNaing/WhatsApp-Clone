//importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessage.js'

//app config
const app=express()
const port = process.env.PORT || 9000


//middleware
app.use(express.json())

//DB config
const connection_url='mongodb+srv://Shoon:nXl8dMFHrJoMiDQc@cluster0.8uj7r.mongodb.net/whatsapp-backend?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(data=>{
    console.log('Database connected')
}).catch(err=>{
    console.log(err)
})
//api 
app.get('/',(req,res)=>res.status(201).send('Hello'))

app.get('/message/sync',(req,res)=>{
    Messages.find()
    .then(data=>{
        res.status(200).send(data)
    })
    .catch(err=>{
        res.status(500).send(err)
    })
})

app.post('/messages/new',(req,res)=>{
    const message = req.body
    Messages.create(message)
    .then(data=>{
        res.status(201).send(data)
    })
    .catch(err=>{
        res.status(500).send(err)
    })
})


app.listen(port,()=>console.log(`Listening on local host ${port}`))