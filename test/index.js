const { spawn, execFile } = require('child_process')
const randomstring = require('randomstring');
const path = require('path')
const { wsPort } = require('./config/constants');
const dirs = [ 'A', 'C'];
const children = [];

dirs.map( (d) => {
    const defaultFile = 'index.js';
    const child = spawn(`node`, [`${defaultFile}`], { cwd: path.join(__dirname, d) });
    child.on('error',(err) => console.log(err))
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => {
        console.log(data)
    })
    child.stderr.on('data', (data) => {
        console.log(data)
    })
    child.on("exit", (code, signal) => {
        console.log('child process exited: ' + code + signal)
    })
    children.push(child)
});

setInterval(() => {
    
},2000)