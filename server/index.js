"use strict";

// Basic express setup:
const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const {MongoClient} = require('mongodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of tweets. It's a basic object with an array in it.

const MONGODB_URI = 'mongodb://localhost:27017/tweeter';

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error('Failed to connect:', MONGODB_URI);
    throw err;
  }

  console.log('Conncted to mongodb:', MONGODB_URI);

  // We now have a hot connection to db

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  app.use("/tweets", tweetsRoutes)


  // function getTweets(callback) {
  //   db.collection('tweets').find().toArray((err, items) => {
  //     callback(err, items)
  //   });
  // }

  // getTweets((err, tweets) => {
  //   if (err) throw err;

  //   console.log('Logging each tweet:');
  //   for (let tweet of tweets) { console.log(tweet) }
  //   db.close();
  // })
})

// Mount the tweets routes at the "/tweets" path prefix:

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});