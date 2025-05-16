const express = require('express'); 
const cors = require("cors");
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
//impot korlam 
const port = process.env.PORT || 5001;

const app = express(); 

// bGffEOQLTKPLo6Tq
// amiarman932

app.use(cors());
app.use(express.json());


//database connection 
const uri = "mongodb+srv://amiarman932:bGffEOQLTKPLo6Tq@userone.2rb28mx.mongodb.net/?retryWrites=true&w=majority&appName=userOne";
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("productDB"); //create database 
    const productCollection = database.collection("events");
    const BookingCollection = database.collection("Bookings");

    app.get('/events' , async(req,res) =>{
        const cursor  = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.post("/events" , async(req,res) =>{
        const event = req.body;
        // console.log("new product ", event);
        const result = await productCollection.insertOne(event);
        res.send(result);
    })

  const { ObjectId } = require('mongodb');

// delete all event 
app.delete('/events/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await productCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

  app.get('/bookings', async (req, res) => {
    try {
      const email = req.query.email;
      console.log("Fetching bookings for email:", email);  // ← add this log
      let query = {};
      if (email) {
        query = { customer_email: email }; // Match field name in DB
      }

      const cursor = BookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ error: "Server error" });
    }
  });


  app.post('/bookings', async (req, res) => {
    try {
      const cartItems = req.body; // Expecting an array
      if (!Array.isArray(cartItems)) {
        return res.status(400).json({ error: "Expected an array of bookings" });
      }
  
      const result = await BookingCollection.insertMany(cartItems); // ✅ fixed line
      res.send(result); // result.acknowledged === true if success
    } catch (error) {
      console.error("Error inserting bookings:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  


app.delete('/bookings/:id', async (req, res) => {
  const id = req.params.id;

  try {
    console.log("Trying to delete booking with ID:", id);

    const result = await BookingCollection.deleteOne({ _id: new ObjectId(id) });



    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Server error" });
  }
});

  
  ///count the order and event 
  // Count total events
app.get('/count/events', async (req, res) => {
  try {
    const count = await productCollection.estimatedDocumentCount();
    res.json({ count });
  } catch (err) {
    console.error("Error counting events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Count total bookings
app.get('/count/bookings', async (req, res) => {
  try {
    const count = await BookingCollection.estimatedDocumentCount();
    res.json({ count });
  } catch (err) {
    console.error("Error counting bookings:", err);
    res.status(500).json({ error: "Server error" });
  }
});

  

  

  
  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send("server runing correctly")
})

app.listen(port, ()=>{
    console.log(`server runing in port:  ${port}`)
})