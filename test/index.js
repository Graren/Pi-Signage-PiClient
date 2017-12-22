const { spawn, execFile } = require('child_process')
const randomstring = require('randomstring');
const path = require('path')
const { wsPort } = require('./config/constants');
const { bindDispatcher } = require('./dispatcher')

const express = require('express');
const http = require('http');
const url = require('url');

const WebSocket = require('ws');
const app = express();
const dirs = [ 'A', 'C'];
const children = [];

const { log, DEBUG, WARNING, ERROR } = require('./dispatcher')
const A = require('./A');
const C = require('./C');

var pubsock = null;

//this is test code
bindDispatcher().then((socket) => {
    A();
    C();
    pubsock = socket
    // setTimeout(() => {
    //     const action = {
    //         type: 'B_FETCH',
    //         url: 'https://i.pinimg.com/236x/05/a2/73/05a2736deebc8e5e2a88c0a6a897a997.jpg',
    //         name: "somefile1",
    //         format: 'jpg'
    //     }
    
    //     const action2 = {
    //         type: 'B_FETCH',
    //         url: 'https://i.pinimg.com/236x/05/a2/73/05a2736deebc8e5e2a88c0a6a897a997.jpg',
    //         name: "somefile2",
    //         format: 'jpg'
    //     }
    
    //     socket.send(['state', JSON.stringify(action)]);
    //     setTimeout(() => {
    //         socket.send(['state', JSON.stringify(action2)]);
    //     },10000)
    // }, 10000);
})

app.use(function (req, res) {
    res.sendFile(path.join(__dirname, 'app', '/index.html'));
  });
  
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  
    ws.on('message', function incoming(message) {
      // log.log(message,DEBUG, "idk")
      const data = JSON.parse(message)
      const action = {
          type: 'B_FETCH',
          url: data.url,
          name: data.name,
          format: data.format
      }
      pubsock.send(['state', JSON.stringify(action)])
    });
    ws.send('something');
  });
  
  server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
  });