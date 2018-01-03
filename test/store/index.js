const zmq = require('zeromq');
const { a_reducer, b_reducer, c_reducer, combineReducers} = require('./reducers')
const { createStore, dispatch, sagaDispatch } = require('./store');
const { B_SUCCESS } = require('./actions') 
const { stPort, wbPort, stSock } = require('../config/constants');

const subsock = zmq.socket('sub');
const clientsock = zmq.socket('pub');
const dispatcherStoreSock = zmq.socket('pub');

subsock.connect('tcp://127.0.0.1:'+ stPort);
subsock.subscribe('state');

clientsock.bindSync('tcp://127.0.0.1:' + wbPort)
dispatcherStoreSock.bindSync('tcp://127.0.0.1:' + stSock)

console.log('Subscriber for state connected to port '+ stPort);
console.log('Publisher for state on port ' + wbPort)
console.log('Publisher for startup on port' + stSock)

const time = setTimeout(()=> {
    dispatcherStoreSock.send(['startup', { start: true }]);
},20000)

subsock.on('message', function(topic, message) {
    const action = JSON.parse(message)
    clearTimeout(time)
    sagaDispatch(action)
});

const rootReducer = combineReducers({
    a: a_reducer,
    b: b_reducer,
    c: c_reducer
})

createStore(rootReducer, clientsock);

