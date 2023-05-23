const express =require('express');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =  process.env.PORT || 5000;
const  cors = require('cors');


// Middleware

app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("Server is Running");
    console.log("Hello world")
})


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
     const addCarCollection =client.db("carCollection").collection("addCarData");
    

     app.get('/collections', async(req,res)=>{
       const mongoCursor = carCollection.find();
       const result= await mongoCursor.toArray();
       res.send(result);
      //  console.log(result)
     })
  
     app.get('/collections/:id', async(req,res)=>{
      const id =req.params.id;
      const findSingleData ={_id: new ObjectId(id)}
      const options ={
        projections:{toy_name:1,subcategory:1,seller:1,price:1,description:1,available_quantity:1,rating:1,subcategory_id:1,picture:1},
      }
      const findResult = await carCollection.findOne(findSingleData,options);
      res.send(findResult);
     })
    //  get  database from post 
     app.get('/new-collections',async(req,res)=>{
      const cursor = addCarCollection.find()
      const result = await cursor.toArray();
      res.send(result);
     })
    
    //  Get email from get method
     app.get('/my-collections', async(req, res) => {
      const email = req.query.email;
      console.log('Email parameter:', req.query.email);
      console.log(req.query.email);
        const query = { email: email };
        const cursor = addCarCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });
    //  Get email from get method
     app.get('/my-collections/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
        const result = await addCarCollection.findOne(query);
        res.send(result);
    });
// Update method 
    app.put('/my-collection/:id', async(req,res)=>{
      const id = req.params.id;
      const filterData = {_id: new ObjectId(id)};
      const options = {upsert:true}
      const updateData = req.body;
      const updateDataFromDelete= {
        $set:{
          available_quantity:updateData.available_quantity,
          price:updateData.price,
          description:updateData.description,
        }
      }
      const result = await addCarCollection.updateOne(filterData,updateDataFromDelete,options);
      res.send(result)
    })

    // Detele Method 
    app.delete('/my-collections/:id', async(req,res)=>{
      const id =req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await addCarCollection.deleteOne(query);
      res.send(result)
    })
    


     app.post('/new-collections', async(req,res)=>{
       const newCarData = req.body;
       const result = await addCarCollection.insertOne(newCarData);
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