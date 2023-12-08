var uuid = require("uuid");
const http = require("http");
const moment = require('moment');
const uuidv4 = require('uuid').v4;
//const socketIo = require('socket.io');
var express = require("express"),
  app = express(),
  server = require("http").createServer(app);


const { encrypt, decrypt } = require("./crypto");
var lstVehicles = [];
var lstConnected = [];
var publicSecretKey = "zoomzoom";
var ioImport;
//start the server
(async () => {
  console.log("welcome to the backend of the aftl");
  //test();
  //game ticks every second
  setInterval(gameTick, 1000);


    //-------express hosting

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    next();
  });
  app.use("/", express.static(__dirname + "/public/"));
  
  var server_http = http.createServer(app);
  server_http.listen(9444, function () {
    console.log("server running at 9444");
  });

  ioImport = require("socket.io")(server_http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  

    multiIoPass();
})();


function gameTick() {
  console.log(lstVehicles);
  lstVehicles.unshift(randomCar());
  if(lstVehicles.length > 1000){
    lstVehicles.pop();
  }

  if(lstVehicles.length <= 100){
    generateData();
  }

  if (ioImport) { // Check if io is initialized
    if(lstVehicles.length > 1){
        var en = encrypt(
            publicSecretKey,
            JSON.stringify({ vehicle: lstVehicles[0] })
          );
        ioImport.emit('gameTick',en );
    }
  }

}

function generateData(count = 10) {
    for (let i = 0; i < count; i++) {
      lstVehicles.push(randomCar());
    }
  }

function randomCar(){
    const data = {
        uuid: uuidv4(),
        timestamp: moment().format(), // Current timestamp in ISO 8601 format
        speed: Math.floor(Math.random() * (110 - 80 + 1)) + 80,
        name:"car" + lstVehicles.length,
        vehicle_id: Math.round(Math.random()),
      };
      return data;
}

//---------------------------socketio

function multiIoPass() {
    ioImport.on("connection", async function (socket) {
    
  });

  return ioImport;
}



