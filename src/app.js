const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'sweWebMovieWorld';
const collectionName = 'Favorite';
let db = undefined;
let collection = undefined;

/**
 * Setup express middleware
 */
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});

/**
 * Connect to database
 */
MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, connection) {
    if (err) throw err;
    db = connection.db(dbName);
    collection = db.collection(collectionName);
});

// TODO: delete after.  is only to check if the connection to the database is established
app.get('/', (req, res) => {
    res.send('Checker');
});

/**
 * Return all Favorites
 */
app.get('/favorite', (req, res) => {
    collection.find({}).sort({ _id: -1 }).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
    });
});

/**
 * Insert one Favorite
 */
app.post('/favorite', (req, res) => {
    const favorite = req.body;
    collection.insertOne(favorite, function(err, result) {
        if (err) throw err;
        res.send({result: 'favorite inserted', favorite: favorite});
    });
});

/**
 * Delete Favorite by id
 */
app.delete('/favorite/:id', (req, res) => {
    const query = { _id: new mongodb.ObjectID(req.params.id) };
    collection.deleteOne(query, function(err, obj) {
        if (err) throw err;
        res.send({result: 'favorite deleted'});
    });
});

/**
 * Start server
 */
app.listen(port, () => {
    console.log(`Favorite app listening at http://localhost:${port}`);
});