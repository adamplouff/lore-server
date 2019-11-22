import express from 'express';
import bodyParser from 'body-parser';

function lore (port, func) {
    if (!port) {
        console.log('Define a port number to listen on');
        return;
    }

    var app = express();

    app.use((req, res, next) => {
        // enable CORS
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'X-CUSTOM, Content-Type');
        next();
    });
    
    var jsonParser = bodyParser.json();
    var textParser = bodyParser.text();

    app.post('/', [jsonParser, textParser], (req, res) => {
        res.write(JSON.stringify(req.headers, null, 2));
        res.write('\n\n');
      
        var contentType = req.get('content-type');
      
        if (contentType.includes('application/json')) {
            if (!func) {
                console.log('Lore: Define a func to do something with this data ↓');
                console.log(req.body);
            } else {
                func(req.body);
            }
            res.write(JSON.stringify(req.body, null, 2));
        }
        res.end();
    });

    var server = app.listen(port, () => {
        // var host = server.address().address;
        var port = server.address().port;
        // console.log('Lore listening at http://%s:%s', host, port);
        console.log('Lore listening at http://127.0.0.1:', port);
    });

    return server;
}

export default lore;