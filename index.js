const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfsyz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

console.log(process.env.DB_USER);

//mongodb database connection



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  // perform actions on the collection object
  //console.log('database connected');
  
  //send/create product to database using app.post method
  app.post('/addProduct', (req, res)=>{
      const products = req.body;
      console.log(products);
      productsCollection.insertOne(products)
      .then(result =>{
          console.log(result.insertedCount);
          res.send(result.insertedCount);
      })

  })

  //read/ get data from mongodb using app.grt method
  app.get('/products', (req, res)=>{
      productsCollection.find({})
      .toArray((err, documents)=>{
          res.send(documents);
      })
  })  

  app.get('/product/:key', (req, res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err, documents)=>{
        res.send(documents[0]);
    })
})  

app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res)=>{
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order)
    .then(result =>{
        
        res.send(result.insertedCount > 0);
    })

})
  
});


app.get('/', (req, res)=>{
    res.send("hello ema watson");
})

app.listen(5000);