const { spawn, execFile } = require('child_process')
const randomstring = require('randomstring');
const path = require('path')
const { wsPort, ADD, DELETE, CHANGE_PLAYLIST, DELETE_PLAYLIST } = require('./config/constants');
const { bindDispatcher } = require('./dispatcher')
const { B_FETCH, B_FAILURE, B_SUCCESS, B_NEW_PLAYLIST, B_DELETE_PLAYLIST, B_DELETE_VIDEO } = require('./store/actions/index')

const dirs = [ 'A', 'C'];
const children = [];

const { log, DEBUG, WARNING, ERROR } = require('./dispatcher')
const A = require('./A');
const C = require('./C');

var pubsock = null;

//this is test code
bindDispatcher().then(({pubsock, subsock}) => {
    A(pubsock);
    C(pubsock);
    pubsock = pubsock
    
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
                ...payload
            }
            break;
          case CHANGE_PLAYLIST:
            const { playlist } = payload  
            const content = playlist.map(c => {
              return {
                ...c
              }
            })
            state_action = {
                type: B_NEW_PLAYLIST,
                playlist: content
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
    
    subsock.on('message', function(topic, message) {
      //Los mensajes llegan en ascii, si tal hacerles toString()
      const msg = JSON.parse(message)
      const action = handle(msg)
      log.log(JSON.stringify(action), DEBUG, 'Websocket subscriber message handler')
      pubsock.send(['state', JSON.stringify(action)])
    });
})