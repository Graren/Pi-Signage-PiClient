const { spawn, execFile } = require('child_process')
const randomstring = require('randomstring');
const path = require('path')
const { wsPort, ADD, DELETE, CHANGE_PLAYLIST, DELETE_PLAYLIST } = require('./config/constants');
const { bindDispatcher } = require('./dispatcher')
const { B_FETCH, B_FAILURE, B_SUCCESS, B_NEW_PLAYLIST, B_DELETE_PLAYLIST, B_DELETE_VIDEO } = require('./store/actions/index')

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
    A(socket);
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
    const handle = ({action, payload}) => {
      let state_action;
      switch(action){
          case DELETE:
          state_action = {
                  type: B_DELETE_VIDEO,
                  id: payload.id,
              }
            break;
          case ADD:
              state_action = {
                type: B_FETCH,
                id: payload.id,
                url: payload.url,
                name: payload.id,
                format: payload.format || '.jpg'
            }
            break;
          case CHANGE_PLAYLIST:
            const { playlist } = payload  
            const videos = playlist.map(video => {
              return {
                id: video.id,
                url: video.url,
                name: video.id,
                format: video.format || '.jpg'
              }
            })
            state_action = {
                type: B_NEW_PLAYLIST,
                playlist: videos
            }
            break;
          case DELETE_PLAYLIST:
            state_action = {
              type: B_DELETE_PLAYLIST
            }
            break;
          default:
            state_action = {}
            break;
      }
      return state_action
  }
    ws.on('message', function incoming(message) {
      // log.log(message,DEBUG, "idk")
      const msg = JSON.parse(message)
      const action = handle(msg)
      console.log(action)
      pubsock.send(['state', JSON.stringify(action)])
    });
  });
  
  server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
  });