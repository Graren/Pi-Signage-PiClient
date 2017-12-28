const express = require('express');
const http = require('http');
const url = require('url');
const { wsPort } = require('./test/config/constants')
const zmq = require('zeromq')
const pubsock = zmq.socket('pub')
const path = require('path')

const WebSocket = require('ws');
const app = express();

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, 'test', 'app', '/index.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

try {
    pubsock.bindSync('tcp://127.0.0.1:' + wsPort);
}
catch(e){
    console.log("welp")
}
wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', function incoming(message) {
    // log.log(message,DEBUG, "idk")
    pubsock.send(['websocket', message])
  });
});

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});
