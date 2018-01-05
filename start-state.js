// const { fork, spawn } = require('index _process');
// fork('./test/store/index.js');
// fork('./test/logger/index.js');
// fork('./test/index.js');
const forever = require('forever-monitor')
process.stdin.resume()

const index = new (forever.Monitor)('./test/index.js', {
  max: 5,
  silent: false,
  minUptime: 2000,
  spinSleepTime: 5000
})

const store = new (forever.Monitor)('./test/store/index.js', {
  max: 5,
  silent: false,
  minUptime: 2000,
  spinSleepTime: 5000
})

const logger = new (forever.Monitor)('./test/logger/index.js', {
  max: 5,
  silent: false,
  minUptime: 2000,
  spinSleepTime: 5000
})

const client = new (forever.Monitor)('./client-socket.js', {
  max: 5,
  silent: false,
  minUptime: 2000,
  spinSleepTime: 5000
})

let indexStarted
let storeStarted

index.on('start', function () {
  console.log('Forever index started for first time.')
  indexStarted = true
})

index.on('exit', function () {
  console.error('ind file has exited after ' + index.max + ' restarts')
})

index.on('error', () => {
  process.kill(store.childData.pid)
  console.error('ind file has errored')
})

index.on('stop', () => {
  process.kill(store.childData.pid)
  console.error('ind file has been killed')
})

store.on('start', function () {
  console.log('store index started for first time.')
  storeStarted = true
})

store.on('exit', function () {
  console.error('store file has exited after ' + store.max + ' restarts')
})

store.on('error', () => {
  console.log('Store errored')
  process.kill(index.childData.pid)
})

logger.on('start', function () {
  console.log('logger index started for first time.')
})

logger.on('exit', function () {
  console.error('store file has exited after ' + logger.max + ' restarts')
})

client.on('start', function () {
  console.log('logger index started for first time.')
})

client.on('exit', function () {
  console.error('client socket died')
})

// Exit handler.
function exitHandler (options, err) {
  try {
        // Killing node process manually that is running "Index.js" file.
    process.kill(index.childData.pid)
    process.kill(store.childData.pid)
    process.kill(logger.childData.pid)
    process.kill(client.childData.pid)    
    console.log('index  process killed succesfully!!')
    console.log('Forever exit!!')
  } catch (err) {
    console.log('index  process already stopped!!')
    console.log('Forever exit!!')
  }

    // Killing forever process.
  process.exit()
}

// Handling user exit events like Ctrl+C.
process.on('SIGINT', exitHandler.bind(null, {exit: true}))

index.start()
store.start()
logger.start()
const timeout = setInterval(() => {
  if(indexStarted && storeStarted){
    clearInterval(timeout)         
     client.start()
  }
}, 20000)