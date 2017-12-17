const { spawn, execFile } = require('child_process')
const randomstring = require('randomstring');
const path = require('path')
const { wsPort } = require('./config/constants');
const { bindDispatcher } = require('./dispatcher')
const dirs = [ 'A', 'C'];
const children = [];

//this is test code
bindDispatcher().then((pubsock) => {
    require('./A');
    require('./C');
    setTimeout(() => {
        const action = {
            type: 'B_FETCH',
            url: 'https://i.pinimg.com/236x/05/a2/73/05a2736deebc8e5e2a88c0a6a897a997.jpg',
            name: "somefile1",
            format: 'jpg'
        }
    
        const action2 = {
            type: 'B_FETCH',
            url: 'https://i.pinimg.com/236x/05/a2/73/05a2736deebc8e5e2a88c0a6a897a997.jpg',
            name: "somefile2",
            format: 'jpg'
        }
    
        pubsock.send(['state', JSON.stringify(action)]);
        setTimeout(() => {
            pubsock.send(['state', JSON.stringify(action2)]);
        },10000)
    }, 10000);
})

// dirs.map( (d) => {
//     const defaultFile = 'index.js';
//     const child = spawn(`node`, [`${defaultFile}`], { cwd: path.join(__dirname, d) });
//     child.on('error',(err) => console.log(err))
//     child.stdout.setEncoding('utf8')
//     child.stderr.setEncoding('utf8')
//     child.stdout.on('data', (data) => {
//         console.log(data)
//     })
//     child.stderr.on('data', (data) => {
//         console.log(data)
//     })
//     child.on("exit", (code, signal) => {
//         console.log('child process exited: ' + code + signal)
//     })
//     children.push(child)
// });

//Just to keep it alive, websocket should keep it alive
setInterval(() => {
    
},2000)