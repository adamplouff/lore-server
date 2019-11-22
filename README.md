# lore-server
A small server that runs inside of Adobe CEP extensions to listen for fetch() messages from other extensions, plugins or local browsers.

## Installation

```bash
$ npm install lore-server
```

## Usage
```
// Via import:
import lore from 'lore-server'

// Via require:
const lore = require('lore-server').default;

```


## Quickstart
### Broadcasting a message from an Adobe extension, web app or plugin:
```
let msgObj = {
    appName: 'Figma',
    version: '1.0.3',
}

lore.message(3400, msgObj)

```
A Lore Message must contain a localhost port number to broadcast to, and a messsge that will be stringified.

### Listening for messages within an Adobe extension:

```
function logMsg(msg) {
    console.log(msg)
}

lore.listener(3400, logMsg)

```

A Lore Listener must contain a localhost port number to listen to, and a function that will do something with the received message. 

*Note:* This is creating a localhost server and must be run within a node app. It cannot be run within the browser.

## Examples
```
// message to be sent to an Adobe extension
let msgObj = {
    actionName: 'popup',
    data: 'This is a message from an alternate dimension'
}

// port# and message data
lore.message(9320, msgObj)
```
```
// message listener inside of Adobe extension
function loreFilter (msg) {
    if (msg.actionName == 'popup') {
        alert(JSON.stringify(msg.data, false, 2))
    } else if (msg.actionName == 'newLayer') {
        /// code to create a new layer ///
    }
}

// port# and message data
lore.listner(9320, loreFilter)
```

The function `loreFilter()` is passed into the `lore.listner()` and parses the data that accompanies any messages received on port 9320. The data contained within this message is arbitrary and must be handled by the function passed into the listener. 

## About
This project is base on how heavily I personally rely on Adobe's [Vulcan](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Vulcan.js) library for communication between Adobe extension panels. An attept to extend this concept outside of Adobe apps lead me to [this article](https://developers.google.com/web/ilt/pwa/lab-fetch-api) on the use of `fetch()` and the creation of localhost servers. **Lore** wraps up a lot of this to simplify server setup and fetch commands.

Thanks to [Tom Scharstein](https://github.com/Inventsable) for ongoing brain power and clarifying the process of creating a module.