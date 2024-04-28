const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gvqow0e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotCollection = client.db("spotDB").collection("spots");
    const countryCollection = client.db("spotDB").collection("countries") ;

    app.post("/spots", async (req, res) => {
      const spotAdded = req.body;
      console.log(spotAdded);
      const result = await spotCollection.insertOne(spotAdded);
      res.send(result);
    });

    app.get("/spots", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/spots/:id',async(req,res)=> {
      const id = req.params.id ;
      const query = {_id: new ObjectId(id)} ;
      const result = await spotCollection.findOne(query) ;
      res.send(result)
  })

    app.get("/email/:email", async (req, res) => {
      const email = req.params.email;
      const result = await spotCollection.find({ email: email }).toArray();
      res.send(result);
    });

    app.get("/country/:country", async (req, res) => {
      const country = req.params.country;
      const result = await spotCollection.find({ country: country }).toArray();
      res.send(result);
    });

    app.get('/countries', async (req, res) => {
      const cursor = countryCollection.find() ;
      const result = await cursor.toArray() ;
      res.send(result) ;
    })




    // spotName, country, location, cost, season, time, visitors, description, name, email, photo

    app.put('/spots/:id', async(req,res)=> {
      const id = req.params.id ;
      const filter = {_id : new ObjectId(id)} ;
      const options  = {upsert : true} ;
      const updatedSpot = req.body ;
      const spot = {
          $set : {
              name: updatedSpot.name, 
              country: updatedSpot.country, 
              location: updatedSpot.location, 
              cost: updatedSpot.cost, 
              time: updatedSpot.time, 
              season: updatedSpot.season, 
              visitors: updatedSpot.visitors, 
              spotName: updatedSpot.spotName, 
              email: updatedSpot.email, 
              photo: updatedSpot.photo, 
              description : updatedSpot.description, 
  
          }
      }
      const result = await spotCollection.updateOne(filter, spot, options) ;
      res.send(result) ;
  })

    app.delete("/spots/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism server is running");
});

app.listen(port, () => {
  console.log(`Tourism server is running on : port ${port}`);
});
