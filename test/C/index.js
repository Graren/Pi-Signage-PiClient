const C = () => {
    const watch = require('../stateWatch/index')
    const { spawn } = require('child_process')
    const paths = require('path')
    const fs = require('fs');
    const { log, DEBUG, WARNING, ERROR } = require('./../dispatcher')
    
    const destination = `A`
    
    // const proc = process.stdout.write.bind(process.stdout)
    
    const component = 'C-watcher';
    
    const onAdd = (path) => {
        console.log(`C: File ${path} has been added`)
        // proc(`C: File ${path} has been added`)   
        const p = path.split(/(\/ |\\)/)
        const sliced = p.slice(1)
        const actualPath = paths.join(...sliced)
        const dest = `${destination}${actualPath}`
        const rd = fs.createReadStream(path);
        rd.on("error", function(err) {
            log.log(`An error happened reading ${err.toString()}`, ERROR, component)
        });
        const wr = fs.createWriteStream(dest);
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
        const sliced = p.slice(1)
        const actualPath = paths.join(...sliced)
        const dest = `${destination}${actualPath}`
        const rd = fs.createReadStream(path);
        rd.on("error", function(err) {
            log.log(`An error happened reading ${err.toString()}`, ERROR, component)
        });
        const wr = fs.createWriteStream(dest);
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
    
    watch.watch('./C',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js|gitignore)/ ,persistent: true })
    
    process.on('beforeExit', async () => {
        await watch.close(() => console.log("EXITED"), ()  => console.log("FUCK"))
    })
}

module.exports = C;