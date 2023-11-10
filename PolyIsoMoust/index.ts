import { obj } from "./obj";
import { oExample } from "./oExample";

const express = require("express");
const app = express();

app.use(express.static("public"));
var port = 3000;

(async () => {
  console.log("Welcome to PolyIsoMoust");
  loadRoutes();
  start();
})();

function loadRoutes() {
  // Endpoint to send the ContentGenerator code as a string
  app.get("/obj.js", (req, res) => {
    const codeString = obj.toString();
    res.setHeader("Content-Type", "application/javascript");
    res.send(codeString);
  });

  app.get("*", (req, res) => {
    //res.send(codeString);

    var p = req.path;
    var pageFound = false;

    if (p == "/") {
      var tempoExample = new oExample();
      res.send(tempoExample.createPage());
    }

    try {
      if (!pageFound) {
        res.status(404).send("404 - Not Found");
        return;
      }
    } catch (ex) {
      console.log(ex);
      res.status(404).send("404 - Not Found");
      return;
    }
  });
}

function start() {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
