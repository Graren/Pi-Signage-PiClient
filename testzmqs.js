const zmq = require('zeromq')
const socket = zmq.socket('pull')

const addr = 'tcp://' + '127.0.0.1:3000'
const msgs = []

const log = (msg) => {
  console.log(msg)
}

socket.on('message', (data) => {
  console.log(data.toString())
  console.log(JSON.parse(data.toString()))
})

socket.connect(addr)
console.log('logging')
