const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT || 5000

// mudileware
app.use(cors())
app.use(express.json())

// db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je6il.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// db check
async function run() {
    try {
        await client.connect();
        const database = client.db("genius");
        const services = database.collection("services");
      
        // get api
        app.get('/services', async(req, res) => {
            const query = {};
            const result = await services.find({});
            const ourServices = await result.toArray()
            res.send(ourServices)
        })

        // find services
        app.get('/services/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const result = await services.findOne(query);
          res.send(result)
        })
        
        //   Post api
        app.post('/addservices', async(req, res) => {
            const result = await services.insertOne(req.body);
            res.json(result)
        })

        // delete services
        app.delete('/services/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const result = await services.deleteOne(query)
          res.json(result)
        })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})