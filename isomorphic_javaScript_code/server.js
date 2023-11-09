// server.js

const express = require("express");
const app = express();
const port = 3000;

class ContentGenerator {
  constructor(title) {
    this.title = title;
    this.appendItSelf();
    this.selfCallItSelf();
  }

  appendItSelf() {
    // This check ensures the code is exported correctly whether it's run in Node or the browser
    if (typeof module !== "undefined" && module.exports) {
      // Node.js module export
      //module.exports = ContentGenerator;
    } else {
      // Browser global variable definition
      // Create a new div element
      const newDiv = document.createElement("div");

      // Set its HTML content
      newDiv.innerHTML = this.generate();

      // Append the new div to the body
      document.body.appendChild(newDiv);
    }
  }

  selfCallItSelf() {
    var detectFetch = true;
    try {
      fetch("/crazy")
        .then((response) => {
          // Check if the request was successful
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text(); // or response.json() if the server sends JSON
        })
        .then((data) => {
          // Create a new div element
          const div = document.createElement("div");

          // Set the inner HTML of the div
          div.innerHTML = data;

          // Append the div to the body
          document.body.appendChild(div);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } catch {
      detectFetch = false;
    }

    if (!detectFetch) {
      if (typeof module !== "undefined" && module.exports) {
        // Node.js module export
        //module.exports = ContentGenerator;
      } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              // When the request is successful, and the response is fully received
              var data = xhr.responseText;
              var div = document.createElement("div");
              div.innerHTML = data;
              document.body.appendChild(div);
            } else {
              // Handle error case
              console.error("There was a problem with the request.");
            }
          }
        };
        xhr.open("GET", "/crazy", true);
        xhr.send();
      }
    }
  }

  generate() {
    return `<h1>${this.title}</h1><p>This is a paragraph.</p>`;
  }
}

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Endpoint to send the ContentGenerator code as a string
app.get("/clientCode.js", (req, res) => {
  const codeString = ContentGenerator.toString();
  res.setHeader("Content-Type", "application/javascript");
  res.send(codeString);
});

app.get("/crazy", (req, res) => {
  var oContentGen = new ContentGenerator("wow");
  res.send(oContentGen.generate());
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
