const express = require('express');
const http = require('http');
const url = require('url');
const { wsPort } = require('./test/config/constants')
const zmq = require('zeromq')
const pubsock = zmq.socket('pub')
const path = require('path')

const WebSocket = require('ws');
let attempts = 0

const deviceGroupId = 1

initialize = async (attempts) => {
    try{
        //TODO REPLACE WITH DJANGO URL
        pubsock.bindSync('tcp://127.0.0.1:' + wsPort);
        const websocket =  await new Promise((resolve, reject) => {
            const ws = new WebSocket('ws://localhost:8000');
            ws.on('open', function open() {
              console.log("Opened")
              resolve(ws)
            });
            ws.on('error', (e) => reject({error:e}))
        })
        websocket.on('message', function incoming(message) {
            const act = JSON.parse(message)
            if (act.deviceGroupId !== deviceGroupId){
                return
            }
            pubsock.send(['websocket', message])
        });
    }
    catch(e) {
        console.log(e)
        console.log("dang")
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