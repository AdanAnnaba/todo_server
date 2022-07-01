const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Hi Lemon')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l32d5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const dbcollections = client.db('todoTask').collection('tasks');

        app.post('/task',async(req,res)=>{
            const task = req.body;
            const result = await dbcollections.insertOne(task);
            res.send(result)
        })

        app.get('/task',async(req,res)=>{
            const query = {}
            const cursor =  dbcollections.find(query);
            const task = await cursor.toArray();
            res.send(task);
        })

        app.delete('/task/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result =await dbcollections.deleteOne(query);
            res.send(result); 
        })

        app.put('/task/:id',async(req,res)=>{
            const id = req.params.id;
            const task = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: task
                    
            };
            const result =await dbcollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.dir)

app.listen(port,()=>{
    console.log('Finally Done!');
})