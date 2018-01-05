const express = require('express')
const http = require('http')
const url = require('url')
const { wsPort, COMPARE_PLAYLIST } = require('./test/config/constants')
const zmq = require('zeromq')
const pubsock = zmq.socket('pub')
const path = require('path')
const configPaths = require('./app/configPaths')
const fs = require('fs')
const fetch = require('node-fetch')

const WebSocket = require('ws')

const device = {
  id: null,
  deviceGroupId: null,
  isAlive: false
}

// thirty seconds reconnection timeout

const timeout = 30 * 1000

const readToken = () =>
  new Promise((resolve, reject) => {
    fs.readFile(configPaths.tokenFile, 'utf8', (err, token) => {
      if (err) {
        return reject(err)
      }

      if (!token) {
        return reject(new Error('Token undefined'))
      }

      resolve(token.replace('\n', ''))
    })
  })

const getDeviceInfo = () =>
  readToken()
    .then(token => {
      const headers = {
        Authorization: `Bearer ${token.trim()}`
      }
      const host = process.env.REMOTE_SIGNAGE_SERVER || '192.168.1.104:8000'
      return fetch(`http://${host}/api/v1/dispositivo/info`, { headers })
    })
    .then(res => {
      return res.json()
    })

const initialize = async () => {
  try {
    const websocket = await new Promise((resolve, reject) => {
      const host = process.env.REMOTE_SIGNAGE_SERVER || '192.168.1.104:8000'
      const ws = new WebSocket('ws://' + host)
      ws.on('open', function open () {
        console.log('Opened')
        device.isAlive = true
        resolve(ws)
      })
      ws.on('error', e => {
        console.log('Connection error')
      })
      ws.on('close', () => {
        console.log('Connection closed, reconnecting . . .')
        setTimeout(initialize, timeout)
      })
    })
    websocket.on('message', function incoming (message) {
      const act = JSON.parse(message)
      const { request, response } = act
      if (
        request.deviceGroupId === device.deviceGroupId ||
        request.deviceId === device.id
      ) {
        // pubsock.send(['websocket', message])
        switch (request.type) {
          case 'REQUEST_GROUP':
            if (response.success) {
              websocket.send(
                JSON.stringify({ type: 'REQUEST_CONTENT', id: device.id })
              )
            }
            break
          case 'REQUEST_CONTENT':
            // console.log(response)
            const msg = {
              action: COMPARE_PLAYLIST,
              payload: response
            }
            pubsock.send(['websocket', JSON.stringify(msg)])
            break
          default:
            pubsock.send(['websocket', message])
        }
      }
    })
    getDeviceInfo()
      .then(data => {
        // id, grupo
        const { grupo, id } = data
        device.deviceGroupId = grupo
        device.id = id
        console.log('Sending request for group data')
        websocket.send(
          JSON.stringify({ type: 'REQUEST_GROUP', deviceGroupId: grupo, id })
        )
      })
      .catch(e => console.log(e))
  } catch (e) {
    console.log(e)
  }
}

try {
  pubsock.bindSync('tcp://127.0.0.1:' + wsPort)
  initialize()
} catch (e) {
  console.log(e)
}

setInterval(() => {}, 5000)
