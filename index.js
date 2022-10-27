const fs = require('fs');
const express = require('express');
const https = require('https')
const http = require('http');
const { resourceLimits } = require('worker_threads');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const robo_main = 'https://60c8ed887dafc90017ffbd56.mockapi.io/robots';
const robo_mirr = 'https://svtrobotics.free.beeceptor.com/robots';
var loadHistory = [];
const key_file = './certs/robot-api-key.pem';
const cert_file = './certs/robot-api-cert.pem';
const options = {
  key: fs.readFileSync(key_file),
  cert: fs.readFileSync(cert_file)
};

http.createServer(app).listen(5000)
https.createServer(options, app).listen(5001)

app.get('/api/robots/closest', (req, result) => {
  try {
    let url = robo_main;
    https.get(url, res => {
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        })
        res.on('end', () => {
            const robots = JSON.parse(rawData);
            result.send(`${JSON.stringify(robots)}`);
        });
    });
  } catch {
    try {
        let url = robo_mirr;
        https.get(url, res => {
            let rawData = '';
            res.on('data', chunk => {
                rawData += chunk;
            })
            res.on('end', () => {
                const robots = JSON.parse(rawData);
                result.send(`${JSON.stringify(robots)}`);
            });
        });
    } catch {
        result.send('both endpoints failed');
    }
  }
})

app.post('/api/robots/closest', (req, result) =>  {
  let load = new Load(req.body.loadId, req.body.x, req.body.y);
  // These try-catch blocks look messy, but were necessary
  // to to catch if the GET fails to receive a response
  // or if the response is not a valid JSON.
  // In both cases, I'm reporting it as a failure
  try {
    let url = robo_main;
    https.get(url, res => {
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        })
        res.on('end', () => {
            try {
                const robots = JSON.parse(rawData);
                let distances = getDistances(robots, load);
                result.send(`${JSON.stringify(distances)}`);
            } catch {
                try {
                    let url = robo_mirr;
                    https.get(url, res => {
                        let rawData = '';
                        res.on('data', chunk => {
                            rawData += chunk;
                        })
                        res.on('end', () => {
                            try {
                                const robots = JSON.parse(rawData);
                                let distances = getDistances(robots, load);
                                result.send(`${JSON.stringify(distances)}`);
                            } catch {
                                result.send('both endpoints failed');
                            }
                        });
                    });
                } catch {
                    result.send('both endpoints failed');
                }
            }
        });
    });
  } catch {
    result.send('both endpoints failed');
  }

})

function getDistances(robots, load) {
  let distances = [];
  robots.forEach((val, index) => {
      const dist = Math.sqrt(
          Math.pow((load.x-val.x),2) + Math.pow((load.y-val.y), 2));
      distances.push({"robotId": val.robotId, "distanceToGoal": dist, "batteryLevel": val.batteryLevel});
  });

  let res = [];
  let underTen = false;
  distances.sort((a, b) => a.distanceToGoal - b.distanceToGoal);
  distances.forEach((d, index) => {
    if (d.distanceToGoal <= 10.0 && d.batteryLevel > 0) {
        res.push(d);
        underTen = true;
    } else if (!underTen && d.distanceToGoal > 10.0 && d.batteryLevel > 0) {
        d.distanceToGoal = Math.round((d.distanceToGoal +  Number.EPSILON) * 100) / 100;
        res.push(d);
        return;
    }
  })
  if (!underTen && res.length > 0) {
    return res[0];
  }
  if (res.length > 0) {
      var maxBattery = res.reduce(
          (a, b) => {
              return a.batteryLevel > b.batteryLevel ? a : b;
          }
      );
      maxBattery.distanceToGoal = Math.round((maxBattery.distanceToGoal + Number.EPSILON) * 100) / 100;
      res.push(maxBattery);
      return maxBattery;
  }
  res.push({ "robotId": null, "distanceToGoal": null, "batteryLevel": null, "errorMessage": "all robots are out of battery"});
  return res[0];
}

function getRobots(result) {
  try {
    let url = robo_main;
    https.get(url, res => {
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        })
        res.on('end', () => {
            const robots = JSON.parse(rawData);
            result.send(`${JSON.stringify(robots)}`);
        });
    });
  } catch {
    try {
        let url = robo_mirr;
        https.get(url, res => {
            let rawData = '';
            res.on('data', chunk => {
                rawData += chunk;
            })
            res.on('end', () => {
                const robots = JSON.parse(rawData);
                result.send(`${JSON.stringify(robots)}`);
            });
        });
    } catch {
        result.send('both endpoints failed');
    }
  }
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