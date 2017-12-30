const C = (pubsock) => {
    const watch = require('../stateWatch/index')
    const { spawn } = require('child_process')
    const paths = require('path')
    const fs = require('fs');
    const { log, DEBUG, WARNING, ERROR } = require('./../dispatcher')
    const { sep } = require('path')    
    const destination = `A`
    const folder = 'test'
    const { C_START } = require('./../store/actions/index')
    // const proc = process.stdout.write.bind(process.stdout)
    
    const component = 'C-watcher';
    const firstRunTimer = 3000
    let firstRun = true

    const onAdd = (path) => {
        // proc(`C: File ${path} has been added`)   
        // const p = path.split(sep)
        // const sliced = p.slice(3)
        // const actualPath = paths.join(folder, destination, ...sliced)
        // const rd = fs.createReadStream(path);
        // rd.on("error", function(err) {
        //     log.log(`An error happened reading ${err.toString()}`, ERROR, component)
        // });
        // const wr = fs.createWriteStream(actualPath);
        // wr.on("error", function(err) {
        //     log.log(`An error happened writing${err.toString()}`, ERROR, component)
        // });
        // rd.pipe(wr);
        // const name = path.split(sep).pop()
        // const format = name.split('.')[1]
        // const id = parseInt(name.split('.')[0])      
        // const action = {
        //     type: C_START,
        //     videos: [{
        //         id,
        //         name,
        //         format,
        //         path
        //     }]
        // }
        // pubsock.send(['state', JSON.stringify(action)])    
        if(firstRun){
            log.log(`C: File ${path} has been restored`, DEBUG, component)
            // pubsock.send(['state', JSON.stringify(action)])
    
            const name = path.split(sep).pop()
            const format = name.split('.')[1]
            const isImage = /jpg|png|bmp/.test(format)
            const id = isImage ? parseInt(name.split('.')[0].split('_')[0]) : parseInt(name.split('.')[0])
            const time = parseInt(name.split('.')[0].split('_')[1])
            //TODO: Remove hardcoded time
            const action = {
                type: C_START,
                content: [{
                    id,
                    name,
                    format,
                    path: paths.join(__dirname, ".." , ".." , path),
                    time: isImage ? time : null
                }]
            }
            // console.log(JSON.stringify(action.videos))
            // log.log(`A: File ${path} has been changed`, DEBUG, component)   
            pubsock.send(['state', JSON.stringify(action)])
        }
    }
    
    const onChange = (path) => {
        log.log(`C: File ${path} has been changed`)
        // log(`C: File ${path} has been changed`)
        // proc(`C: File ${path} has been changed`)    
        const p = path.split(sep)
        const sliced = p.slice(2)
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
        log.log(`C: File ${path} has been deleted`)   
        // log(`C: File ${path} has been removed`)
        // proc(`C: File ${path} has been fucked`) 
    }

    setTimeout(() => {
        watch.watch('./test/C',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js|gitignore)/ })
        
        process.on('beforeExit', async () => {
            await watch.close(() => console.log("EXITED"), ()  => console.log("FUCK"))
        })

        setTimeout(() => {
            firstRun = false
        }, firstRunTimer)

    }, 2000)
}

module.exports = C;