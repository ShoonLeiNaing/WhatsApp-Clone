//importing
import express from 'express'

//app config
const app=express()
const port = process.env.PORT || 9000


//middleware

//DB config

//api 
app.get('/',(req,res)=>res.status(201).send('Hello'))
app.listen(port,()=>console.log(`Listening on local host ${port}`))