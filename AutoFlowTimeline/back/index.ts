var uuid = require("uuid");
const http = require("http");
var express = require("express"),
  app = express(),
  server = require("http").createServer(app);

const { encrypt, decrypt } = require("./crypto");
var lstVehicles = [];

//start the server
(async () => {
  console.log("welcome to the backend of the aftl");
  //test();
  //game ticks every second
  setInterval(gameTick, 1000);


  const ioImport = require("socket.io")(server_http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

    multiIoPass(ioImport);
})();


function gameTick() {
  //console.log("run");
}


//---------------------------socketio

function multiIoPass(io) {
  io.on("connection", async function (socket) {
    
  });

  return io;
}

//-------express hosting

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  next();
});
app.use("/", express.static(__dirname + "/cloud/"));

var server_http = http.createServer(app);
server_http.listen(9444, function () {
  console.log("server running at 9444");
});

const ioImport = require("socket.io")(server_http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
