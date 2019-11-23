// express.js is server side and only runs in node - not a browser. This excludes loading it for the web.
try {
  var express = require("express");
  var bodyParser = require("body-parser");
} catch (error) {}

const PORT = "3200";
const HOST = "127.0.0.1";

// handling of fetch messages
function validateResponse(response) {
  console.log(response);

  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function logResult(result) {
  console.log(result);
}

function logError(error) {
  console.log("Looks like there was a problem:", error);
}

// Exports all functions needed to be imported from another file.
// Any of these functions can be imported via:
// import { loreListener, loreMessage } from 'lore'
class Lore {
  constructor(port, address) {
    //
    this.port = port || PORT;
    this.address = address || HOST;
    this.app = express();
    this.headers = new Headers();
  }
  init() {
    this.app.use((req, res, next) => {
      // enable CORS
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      res.set("Access-Control-Allow-Headers", "X-CUSTOM, Content-Type");

      this.headers.append("Content-Type", "application/json");
      next();
    });
  }

  // port number to listen for messages
  // function that does something with received data
  listener(func) {
    if (!express) {
      console.log(
        "loreListener runs in Node, not the browser. Use this in an Adobe extension to listen for messages."
      );
    }

    if (!this.port) {
      console.log("Define a port number to listen on");
      return;
    }

    var jsonParser = bodyParser.json();
    var textParser = bodyParser.text();
    this.app.post("/", [jsonParser, textParser], (req, res) => {
      res.write(JSON.stringify(req.headers, null, 2));
      res.write("\n\n");

      var contentType = req.get("content-type");

      if (contentType.includes("application/json")) {
        if (!func) {
          console.log("Lore: Define a func to do something with this data ↓");
          console.log(req.body);
        } else {
          func(req.body);
        }
        res.write(JSON.stringify(req.body, null, 2));
      }
      res.end();
    });

    var server = this.app.listen(this.port, () => {
      // var host = server.address().address;
      var port = server.address().port;
      // console.log('Lore listening at http://%s:%s', host, port);
      console.log(`Lore listening at http://${this.address}:${this.port}`);
      //   console.log("Lore listening at http://127.0.0.1:", port);
    });

    return server;
  }
  // port number to broadcast messages to listener
  // data to send
  message(data) {
    fetch(`http://${this.address}:${this.port}/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(data)
    })
      .then(validateResponse)
      .catch(logError);
  }
}

export default Lore;
