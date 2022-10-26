const fs = require('fs');
const express = require('express');
const https = require('https')
const http = require('http')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const key_file = './certs/robot-api-key.pem';
const cert_file = './certs/robot-api-cert.pem';
const robo_main = 'https://60c8ed887dafc90017ffbd56.mockapi.io/robots';
const robo_mirr = 'https://svtrobotics.free.beeceptor.com/robots';
var loadHistory = [];
const options = {
  key: fs.readFileSync(key_file),
  cert: fs.readFileSync(cert_file)
};

http.createServer(app).listen(5000)
https.createServer(options, app).listen(5001)

app.get('/', (req, res) => {
    res.send(`Get request!\n${JSON.stringify(req.body)}\n${JSON.stringify(loadHistory)}`);
})

app.post('/api/robots/closest', async (req, res) =>  {
  let load = new Load(req.body.loadId, req.body.x, req.body.y);
  const robots = await getRobots();
  console.log(`robots: ${JSON.stringify(robots)}`);
//  robots.forEach((val, index) => {
//      const dist = Math.sqrt(
//          Math.pow((load.x-val.x),2) + Math.pow((load.y-val.y), 2));
//      console.log(`robotId: ${val.robotId}`);
//      console.log(`distanceToGoal: ${dist}`);
//      console.log(`batteryLevel: ${val.batteryLevel}`);
//  });
//  console.log(`loadId: ${req.body.loadId}`);
//  console.log(`x: ${req.body.x}`);
//  console.log(`y: ${req.body.y}`);
//  console.log();
  loadHistory.push(load);
  res.send(`posted: ${JSON.stringify(req.body)}`);
})

async function getRobots() {
    let result;
    try {
        result = await getRequest(robo_main);
        console.log(`getRobots try: ${JSON.stringify(result)}`);
    } catch (err) {
        console.log('main endpoint failed, trying mirror...');
        try {
            result = await getRequest(robo_mirr);
            console.log(`getRobots try.try: ${JSON.stringify(result)}`);
        } catch (err) {
            result = {"error_message": "both endpoints broken"};
            console.log(`getRobots catch.catch: ${JSON.stringify(result)}`);
        }
    } finally {
        console.log(`getRobots finally: ${JSON.stringify(result)}`);
        return result;
    }
}

async function getRequest(url) {
    let result;
    console.log(`getRequest url: ${url}`);
    await https.get(url, async res => {
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        })
        await res.on('end', async () => {
            const parsedData = JSON.parse(rawData);
            console.log(`getRequest.res.on url: ${url}`);
            result = parsedData;
            console.log(`getRequest.res.on.result: ${JSON.stringify(result)}`);
        });
    });
    console.log(`getRequest.result: ${JSON.stringify(result)}`);
    return result;
}

class Load {
    constructor(loadId, x, y) {
        this.loadId = loadId;
        this.x = x;
        this.y = y;
    }
}

class Robot {
    constructor(robotId, distanceToGoal, batteryLevel) {
        this.robotId = robotId;
        this.distanceToGoal = distanceToGoal;
        this.batteryLevel = batteryLevel;
    }
}
// function getFile(idx: number) : String {
//   const file = fs.readFileSync('robots.json','utf8');
//   const obj = JSON.parse(file);
//   console.log(obj[0]);
//   return obj[idx];
// }
