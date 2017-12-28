const express = require('express');
const http = require('http');
const url = require('url');
const { wsPort } = require('./test/config/constants')
const zmq = require('zeromq')
const pubsock = zmq.socket('pub')
const path = require('path')

const WebSocket = require('ws');
let attempts = 0


initialize = (attempts) => {
    try{
        //TODO REPLACE WITH DJANGO URL
        pubsock.bindSync('tcp://127.0.0.1:' + wsPort);
        const ws = new WebSocket('ws://somewhereaaaa:8080');
        
        ws.on('open', function open() {
          console.log("Opened")
        });
        
        ws.on('error', (e) => {throw e})
        
        ws.on('message', function incoming(message) {
          pubsock.send(['websocket', message])
        });
    }
    catch(e) {
        console.log(e)
        throw {error: e, attempts: attempts+1}
    }
}

try{
    initialize(attempts)
}
catch(e){
    console.log("welp")
}

setInterval(() => {
    return
}, 5000)