const C = () => {
    const watch = require('../stateWatch/index')
    const { spawn } = require('child_process')
    const paths = require('path')
    const fs = require('fs');
    const { log, DEBUG, WARNING, ERROR } = require('./../dispatcher')
    const { sep } = require('path')    
    const destination = `A`
    const folder = 'test'
    // const proc = process.stdout.write.bind(process.stdout)
    
    const component = 'C-watcher';
    
    const onAdd = (path) => {
        // proc(`C: File ${path} has been added`)   
        const p = path.split(sep)
        const sliced = p.slice(3)
        const actualPath = paths.join(folder, destination, ...sliced)
        const rd = fs.createReadStream(path);
        rd.on("error", function(err) {
            log.log(`An error happened reading ${err.toString()}`, ERROR, component)
        });
        const wr = fs.createWriteStream(actualPath);
        wr.on("error", function(err) {
            log.log(`An error happened writing${err.toString()}`, ERROR, component)
        });
        rd.pipe(wr);
    }
    
    const onChange = (path) => {
        console.log(`C: File ${path} has been changed`)
        // log(`C: File ${path} has been changed`)
        // proc(`C: File ${path} has been changed`)    
        const p = path.split(/(\/ |\\)/)
        const sliced = p.slice(3)
        const actualPath = paths.join(folder, destination, ...sliced)        
        const rd = fs.createReadStream(path);
        rd.on("error", function(err) {
            log.log(`An error happened reading ${err.toString()}`, ERROR, component)
        });
        const wr = fs.createWriteStream(actualPath);
        wr.on("error", function(err) {
            log.log(`An error happened writing${err.toString()}`, ERROR, component)
        });
        rd.pipe(wr);
    }
    
    const onDelete = (path) => {
        console.log(`C: File ${path} has been deleted`)   
        // log(`C: File ${path} has been removed`)
        // proc(`C: File ${path} has been fucked`) 
    }
    
    watch.watch('./test/C',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js|gitignore)/ ,persistent: true })
    
    process.on('beforeExit', async () => {
        await watch.close(() => console.log("EXITED"), ()  => console.log("FUCK"))
    })
}

module.exports = C;