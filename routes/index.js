require('dotenv').config();
var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var sensor = require("node-dht-sensor");
const uri = process.env.mongodbUrl;
const location = process.env.location;
const mdbName = process.env.mdbName;
const mdbColl = process.env.mdbColl;
let currentData;

/* GET home page. */
router.get('/', function(req, res, next) {
  retrieveData()
  .then((rData) => { 
    let currentTemp = (((rData[rData.length - 1]['data']['temp']) * ( 9 / 5 )) + 32).toFixed(1);
    let currentHum = rData[rData.length - 1]['data']['humidity'].toFixed(1);
    let currentTimestamp = rData[rData.length - 1]['datetime']['timestamp'];
    // render with unit location as well
    res.render('index', { 
      title: 'Home Environment Monitor', tempF: currentTemp, humidity: currentHum, date: currentTimestamp, location: location }); 
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

// read sensor
// sample from https://github.com/momenso/node-dht-sensor

let tf;
let hum;
let date;
let mdbData;

function readSensor() {
  sensor.read(22, 4, function(err, temperature, humidity) {
    if (!err) {
      let tempF = (temperature * ( 9 / 5 )) + 32;
      tf = `${tempF.toFixed(1)}`;
      hum = `${humidity.toFixed(1)}`;
      date = new Date();      
      console.log(`temp: ${temperature}°C / ${tf}°F, humidity: ${hum}% 
      @ ${date}`);

      mdbData = {
          "datetime": {
              "timestamp": date,
              "ms": date.getTime()
          },
          "data": {
              "temp": temperature,
              "humidity": humidity
          },
          "location": location
      }      

      postData(mdbData);
    }
  });  
}

setTimeout(readSensor, 60000);
setInterval(readSensor, 300000);

// post to mongoDB
function postData(d) {
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  async function run() {
    try {
      await client.connect();

      const database = client.db(mdbName);
      const collection = database.collection(mdbColl);

      // create a document to be inserted
      const doc = d;
      const result = await collection.insertOne(doc);

      console.log(
        `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
      );
    } catch (err) {
      console.log(`Unable to post data: ${err}`);
      reboot();
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
}

// read from mongoDB
function retrieveData() {
  let prom = new Promise((resolve, reject) => {
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();
  
        const database = client.db(mdbName);
        const collection = database.collection(mdbColl);
  
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

function reboot() {

  console.log(`Rebooting RPi @ ${new Date()} ...`);

  exec('sh /usr/local/bin/reboot.sh', function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
  });
};

module.exports = router;