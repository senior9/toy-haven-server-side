const express =require('express');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =  process.env.PORT || 5000;
const  cors = require('cors');


// Middleware

app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("Server is Running");
    console.log("Hello world")
})

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.yx2s4d1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
     const carCollection = client.db("carCollection").collection("carData");

     app.get('/collections', async(req,res)=>{
       const mongoCursor = carCollection.find();
       const result= await mongoCursor.toArray();
       res.send(result);
     })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port,()=>{
    console.log("apps running ")
})