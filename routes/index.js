require('dotenv').config();
var express = require('express');
var router = express.Router();
const uriA = process.env.mongodbUrlA;
const uriB = process.env.mongodbUrlB;
const mdbNameA = process.env.mdbNameA;
const mdbCollA = process.env.mdbCollA;
const mdbNameB = process.env.mdbNameB;
const mdbCollB = process.env.mdbCollB;
const envVar = {
  'a': {
    'uri': uriA,
    'mdbName': mdbNameA,
    'mdbColl': mdbCollA
  },
  'b': {
    'uri': uriB,
    'mdbName': mdbNameB,
    'mdbColl': mdbCollB
  }
}
let currentData;

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/unit/a');
});

router.get('/unit/:unit', function(req, res, next) {
  let ab = 'a';
  if (req.params) {
    ab = req.params['unit'];
  }
  
  retrieveData(ab)
  .then((rData) => { 
    let currentTemp = (((rData[rData.length - 1]['data']['temp']) * ( 9 / 5 )) + 32).toFixed(1);
    let currentHum = rData[rData.length - 1]['data']['humidity'].toFixed(1);
    let currentTimestamp = rData[rData.length - 1]['datetime']['timestamp'];
    let location = rData[rData.length - 1]['location'];    
    // render with unit location as well
    res.render('index', { 
      title: 'Home Environment Monitor', tempF: currentTemp, humidity: currentHum, 
      date: currentTimestamp, location: location, unit: ab }); 
  })
  .catch((err) => { 
    res.render('index', { 
      title: 'Home Environment Monitor', tempF: 'err', humidity: 'err', date: err }); 
  }); // change to be more useful!
});

router.get('/data', (req, res, next) => {
  fetchCurrentData()
  .then((fData) => {
    res.send(fData);
  })
  .catch((err) => {
    res.send([ 'error', 'Error getting graph data.', err ]);
  });
});

// read from mongoDB
function retrieveData(ab) {
  console.log('Retrieving data from:');
  console.log(envVar[ab]['uri']);

  let prom = new Promise((resolve, reject) => {
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(envVar[ab]['uri'], { useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();
  
        const database = client.db(envVar[ab]['mdbName']);
        const collection = database.collection(envVar[ab]['mdbColl']);
  
        // CREATE query for the last 48 hours
        let timeNow = new Date();
        timeNow = Date.parse(timeNow);
        timeWindow = timeNow - 172800000;
        const query = { "datetime.ms": { $gt: timeWindow } };
        const sort = { "datetime.ms": 1 };
        const options = {
          projection: { _id: 0 },
        };      
  
        const cursor = collection.find(query, options).sort(sort);
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
          console.log("No documents found!");
          reject('Retrieval error.');
        }
        // await cursor.forEach(console.dir);
        const allValues = await cursor.toArray();
        currentData = allValues;
        resolve(allValues);
      } catch (err) {
        console.log(`Unable to retrieve data: ${err}`)
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);    
  });
  return prom;
}

function fetchCurrentData() {
  let prom = new Promise((resolve, reject) => {
    if (currentData) {
      resolve(currentData);
    } else {
      reject('Error: No local data fetched.');
    }
  });
  return prom;
}

module.exports = router;