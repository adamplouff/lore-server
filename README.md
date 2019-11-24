# lore-server

A small server that runs inside of Adobe CEP extensions to listen for fetch() messages from other extensions, plugins or local browsers.

## Installation

```bash
$ npm install lore-server
```

## Usage

```js
// Via import:
import Lore from "lore-server";

// Via require:
const Lore = require("lore-server").default;
```

## Quickstart

### Create a new Lore instance:

```js
// Import name becomes class object
import Lore from "lore-server";

// Server can then be created via new [class name]
const lore = new Lore(3200); // 3200 is the port we listen to

// Each class is a separate instance, independent of each other
const server = new Lore(3030, "127.0.0.1"); // Second param is address

console.log(lore);
console.log(server);
```

### Broadcasting a message from an Adobe extension, web app or plugin:

```js
// If neither port nor address are defined, they default to:
// http://127.0.0.1:3200
const lore = new Lore();

let msgObj = {
  appName: "Figma",
  version: "1.0.3"
};

lore.message(msgObj);
```

A Lore Message must contain a message that will be stringified.

### Listening for messages within an Adobe extension:

```js
function logMsg(msg) {
  console.log(msg);
}

lore.listener(logMsg);
```

A Lore Listener must contain a function that will do something with the received message.

_Note:_ This is creating a localhost server and must be run within a node app. It cannot be run within the browser.

## Examples

```js
// message to be sent to an Adobe extension
let msgObj = {
  actionName: "popup",
  data: "This is a message from an alternate dimension"
};

// message data
lore.message(msgObj);
```

```js
const lore = new Lore(9320);

// message listener inside of Adobe extension
function loreFilter(msg) {
  if (msg.actionName == "popup") {
    alert(JSON.stringify(msg.data, false, 2));
  } else if (msg.actionName == "newLayer") {
    /// code to create a new layer ///
  }
}

// message data
lore.listener(loreFilter);
```

The function `loreFilter()` is passed into the `lore.listener()` and parses the data that accompanies any messages received on port 9320. The data contained within this message is arbitrary and must be handled by the function passed into the listener.

## About

This project is based on how heavily I personally rely on Adobe's [Vulcan](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Vulcan.js) library for communication between Adobe extension panels. An attempt to extend this concept outside of Adobe apps led me to [this article](https://developers.google.com/web/ilt/pwa/lab-fetch-api) on the use of `fetch()` and the creation of localhost servers. **Lore** wraps up a lot of this to simplify server setup and fetch commands.

Thanks to [Tom Scharstein](https://github.com/Inventsable) for ongoing brain power and clarifying the process of creating a module.
