const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nhrod4k.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('ServiceData').collection('Services')
        const reviewCollection = client.db('ServiceData').collection('ServiceReviews')
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/homeservices', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services.slice(services.length-3, services.length));
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.get('/editreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });
        app.post('/addservice',  async (req, res) => {
            const service = req.body; 
            const result = await serviceCollection.insertOne(service); 
            res.send(result);
        });
        app.post('/addreview',  async (req, res) => {
            const review = req.body; 
            const result = await reviewCollection.insertOne(review); 
            res.send(result);
        });
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = await reviewCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        });
        app.get('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { uid: id };
            const cursor = await reviewCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        });
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const cmnt = req.body.updatedReview;
            const query = { _id: ObjectId(id) }
            const updatedReview = {
                $set:{
                    comment: cmnt
                }
            }
            const result = await reviewCollection.updateOne(query, updatedReview);
            res.send(result);
        })





    }
    catch(err){
         console.log(err);
    }
    finally{

    }
}

run().catch(e => console.error*(e));

app.get('/', (req, res) => {
    res.send('service server is running')
})

app.listen(port, () => {
    console.log(`service server is running on ${port}`);
})