const express = require('express');
const http = require('http');
const url = require('url');
const { wsPort } = require('./test/config/constants')
const zmq = require('zeromq')
const pubsock = zmq.socket('pub')
const path = require('path')
const configPaths = require('./app/configPaths');
const fs = require('fs');
const fetch = require('node-fetch');

const WebSocket = require('ws');
let attempts = 0

const device = {
    id: null,
    deviceGroupId: null
}


const readToken = () =>
    new Promise((resolve, reject) => {
        fs.readFile(configPaths.tokenFile, 'utf8', (err, token) => {
            if (err) {
                reject({ error: err, token: 'test' });
            }

            resolve(token);
        });
    });

const getDeviceInfo = () =>
    readToken()
        .then((token) => {
            const headers = {
                Authorization: `Bearer ${token.trim()}`
            };
            const host = process.env.REMOTE_SIGNAGE_SERVER || '192.168.1.104:8000'
            return fetch(`http://${host}/api/v1/dispositivo/info`, { headers });
        })
        .then(res =>{
            return  res.json()
        })
        .catch(e => {
            console.log(e)
        })



initialize = async (attempts) => {
    try{
        //TODO REPLACE WITH DJANGO URL
        pubsock.bindSync('tcp://127.0.0.1:' + wsPort);
        const websocket =  await new Promise((resolve, reject) => {
            try{
                const host = process.env.REMOTE_SIGNAGE_SERVER || '192.168.1.104:8000'
                const ws = new WebSocket('ws://'+host);
                ws.on('open', function open() {
                    console.log("Opened")
                    resolve(ws)
                });
                ws.on('error', (e) => reject({error:e}))
            }
            catch(e) {
                console.log(e)
            }
        })
        websocket.on('message', function incoming(message) {
            const act = JSON.parse(message)
            console.log(act)
            console.log(device)
            if (act.deviceGroupId === device.deviceGroupId || act.deviceId === device.id){
                // pubsock.send(['websocket', message])
                const { request } = act
                switch(request){
                    case 'REQUEST_GROUP':
                        console.log("rg")
                        websocket.send(JSON.stringify({ type: 'REQUEST_GROUP', deviceGroupId: grupo, id}))
                        
                        break;
                    case 'REQUEST_CONTENT':
                        console.log(rq)
                        break;
                    default:
                    console.log("default")
                        // pubsock.send(['websocket', message])
                        
                }
            }
        });
        getDeviceInfo().then(data => {
            //id, grupo
            const { grupo, id } = data
            device.deviceGroupId = grupo
            device.id = id
            console.log("Sending request")
            websocket.send(JSON.stringify({ type: 'REQUEST_GROUP', deviceGroupId: grupo, id}))
        }).catch(e => console.log(e))
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