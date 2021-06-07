//importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessage.js'
import Pusher from 'pusher'
import cors from 'cors'

//app config
const app = express()
const port = process.env.PORT || 9000


//middleware
app.use(express.json())
app.use(cors())

const pusher = new Pusher({
    appId: "1215402",
    key: "e1c8483449bc203d14bc",
    secret: "ca7baafc9b5e19f2c2e2",
    cluster: "ap1",
    useTLS: true
});
const db = mongoose.connection; //when db is open, it fires this function
db.once('open', () => {
    const msgCollections = db.collection('messagecontents') //select the collection
    const changeStream = msgCollections.watch() //detect changes in collection
    changeStream.on('change', (change) => { //if changes detected, this function fired
        console.log(change)
        if(change.operationType === 'insert'){
            const messageDetail = change.fullDocument;
            pusher.trigger('messages','inserted',{
                name:messageDetail.name,
                message:messageDetail.message
            })
        }else{
            console.log("Error triggering pusher")
        }
    })
    
})

//DB config
const connection_url = 'mongodb+srv://Shoon:nXl8dMFHrJoMiDQc@cluster0.8uj7r.mongodb.net/whatsapp-backend?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(data => {
    console.log('Database connected')
}).catch(err => {
    console.log(err)
})


//api 
app.get('/', (req, res) => res.status(201).send('Hello'))

app.get('/message/sync', (req, res) => {
    Messages.find()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

app.post('/messages/new', (req, res) => {
    const message = req.body
    Messages.create(message)
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})


app.listen(port, () => console.log(`Listening on local host ${port}`))