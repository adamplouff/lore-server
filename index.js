// express.js is server side and only runs in node - not a browser. This excludes loading it for the web.
try {
  var express = require("express");
  var bodyParser = require("body-parser");
} catch (error) {}

// Define fallbacks in case user doesn't designate PORT/ADDRESS
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
export default class {
  // constructor parameters are ones from any class creation, e.g. new Lore(port, address)
  constructor(port, address) {
    // We define things which other functions need access to here:
    this.port = port || PORT;
    this.address = address || HOST;
    // If we only need to do code once, it makes more sense to do so here than every time a listen() or message() func is called
    this.app = express();
    this.headers = new Headers();
    this.init();
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

    // Anything else this Lore instance needs to do before it begins listening/sending should happen here, or above
  }

  // port number to listen for messages
  // function that does something with received data
  listener(func) {
    if (!express) {
      console.log(
        "loreListener runs in Node, not the browser. Use this in an Adobe extension to listen for messages."
      );
    }

    // This should never happen since we have fallbacks:
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
      var port = server.address().port;
      // Changing all strings to a template literal for ease of use:
      // https://css-tricks.com/template-literals/
      console.log(`Lore listening at http://${this.address}:${this.port}`);
      //   console.log("Lore listening at http://127.0.0.1:", port);
    });

    return server;
  }
  // data to send
  message(data) {
    // Compare `http://${this.address}:${this.port}/` to 'http://127.0.0.1:'+ port +'/'
    // Is this easier to read, or is it only because I'm so used to template literals?
    fetch(`http://${this.address}:${this.port}/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(data)
    })
      .then(validateResponse)
      .catch(logError);
  }
}
