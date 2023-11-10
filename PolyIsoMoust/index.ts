const express = require("express");
const mime = require("mime");

import { obj } from "./obj";
import { oExample } from "./oExample";

const app = express();

app.use(express.static("public"));
var port = 3000;

(async () => {
  console.log("Welcome to PolyIsoMoust");
  loadRoutes();
  start();
})();

function loadRoutes() {
  var mapClasses = new Map();

  mapClasses.set("obj.js", obj.toString());

  app.get("*", (req, res) => {
    try {
      //res.send(codeString);

      var p = req.path;

      if (p == "/") {
        var tempoExample = new oExample();
        res.send(tempoExample.createPage());
        return;
      }

      var pathFile = req.path.substring(1);
      const mimeType = mime.getType(pathFile);

      if (mapClasses.has(pathFile)) {
        if (mimeType) {
          res.setHeader("Content-Type", mimeType);
        }

        res.send(mapClasses.get(pathFile));
        return;
      }

      res.status(404).send("404 - Not Found");
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
