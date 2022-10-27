# SVT Robotics - Take Home Recruiting Assessment
## \*See bottom for [Prerequisites](#prerequisites) and [How to Run](#how-to-run).

One of SVT's microservices calculates which robot should transport a pallet from point A to point B based on which robot is the closest and has the most battery left if there are multiple in the proximity of the load's location. You'll use a provided API endpoint to create a simplified robot routing API.

This is the endpoint to retrieve a list of robots in our robot fleet: https://60c8ed887dafc90017ffbd56.mockapi.io/robots. Note: if that URL doesn't work, a mirror is available here - https://svtrobotics.free.beeceptor.com/robots.

The provided API returns a list of all 100 robots in our fleet. It gives their current position on an xy-plane along with their battery life. Your job is to write an API with an endpoint which accepts a payload with a load which needs to be moved including its identifier and current x,y coordinates and your endpoint should make an HTTP request to the robots endpoint and return which robot is the best to transport the load based on which one is closest the load's location. If there is more than 1 robot within 10 distance units of the load, return the one with the most battery remaining.

The distance between two points is found with the following formula:

![distance formula](https://user-images.githubusercontent.com/7139741/122107356-f915e300-cde8-11eb-8699-f87b50046350.png)

If the API receives a JSON payload of:

```
{
    loadId: 231, //Arbitrary ID of the load which needs to be moved.
    x: 5, //Current x coordinate of the load which needs to be moved.
    y: 3 //Current y coordinate of the load which needs to be moved.
}
```

It should respond with a JSON payload of _(note: this is just an example, your results may be different depending on the data available from the API at the time.)_:

```
{
    robotId: 58,
    distanceToGoal: 49.9, //Indicates how far the robot is from the load which needs to be moved.
    batteryLevel: 30 //Indicates current battery level of the robot.
}
```

### Requirements

1. API with POST endpoint that accepts and returns data per the above task description
   1. POST endpoint **must** be **`https://localhost:5001/api/robots/closest/`** or **`http://localhost:5000/api/robots/closest/`**
   2. POST endpoint **must** accept and return JSON
2. API can be run locally and tested using Postman or other similar tools
3. Description of what features, functionality, etc. you would add next and how you would implement them - you shouldn't spend more than a few hours on this project, so we want to know what you'd do next (and how you'd do it) if you had more time
4. Use git and GitHub for version control
5. Have fun! We're interested in seeing how you approach the challenge and how you solve problems with code. The goal is for you to be successful, so if you have any questions or something doesn't seem clear don't hesitate to ask. Asking questions and seeking clarification isn't a negative indicator about your skills - it shows you care and that you want to do well. Asking questions is always encouraged at SVT Robotics, and our hiring process is no different.

Deliverables Checklist

1. API written in Javascript, Typescript, .NET Core, or a similar language
2. API accepts POST and returns data per above requirements
3. Repo README has instructions for running and testing the API
4. Repo README has information about what you'd do next, per above requirements
5. Create a new public GitHub repo and upload its url to the link you received in your test invite.

# Prerequisites
## Run Locally
-  node.js ^18.11.5
## Run in Docker
- Docker Desktop (running)
# How to Run
## Locally
- (from command line, in project root)
`
$ npm start
`
- POST {\<Load\>}
## Docker
- (from commanad line, in project root)
### MACOS/Linux/UNIX/BSD
`
$ ./docker.sh
`
- POST {\<Load\>}
- Test tool included ./test/post.sh

`
  $ cd test
`

`
  $ . post.sh
`

`
$ post <loadId> <x> <y> 
` // https

`
$ posti <loadId> <x> <y> 
` // http
### Windows
\* Experimental (only tested on MACOS 10.15.7, but should work)

\> ./docker.cmd

- POST {\<Load\>}

\* Ctrl-C will stop the docker container and delete it since it was started with the -d option. Just run the script again to build/restart it. It will go much faster on subsequent runs because the image is already built.

### Any Platform (once running)
To see all robots:

\* GET https://localhost:5001/api/robots/closest

\* GET http://localhost:5000/api/robots/closest


# Next Steps
- Add support for request to include delivery location for load.
- Determine battery required for robot to travel to load and deliver it to its destination.
- Add support for batch loads, returning robotIds for each load.
- Add locations of robot charging stations.
- Optimize for loads to be delivered with enough remaining battery for robots to reach a charging station, unassisted.
- Add UI with scatter plot of assets before and after deliveries and send load requests.
- Color-code assets on scatter plot to identify robots, loads, charging stations with a color spectrum for robots to indicate battery levels.