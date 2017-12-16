const zmq = require('zeromq');
const { a_reducer, b_reducer, c_reducer, combineReducers} = require('./reducers')
const { createStore, dispatch, sagaDispatch } = require('./store');
const { B_SUCCESS } = require('./actions') 
const { stPort } = require('../config/constants');

const subsock = zmq.socket('sub');

const rootReducer = combineReducers({
    a: a_reducer,
    b: b_reducer,
    c: c_reducer
})

createStore(rootReducer)

subsock.connect('tcp://127.0.0.1:'+ stPort);
subsock.subscribe('state');
console.log('Subscriber for : websocket connected to port '+ stPort);

subsock.on('message', function(topic, message) {
    console.log('received a message related to:', topic, 'containing message:', message);
    const action = JSON.parse(message)
    sagaDispatch(action)
});