const A = (pubsock) => {
    const watch = require('../stateWatch/index')
    const { log, DEBUG, WARNING } = require('./../dispatcher')
    const { A_FETCH, A_SUCCESS, A_FAILURE, A_DELETE_SUCCESS} = require('./../store/actions/index')
    const { sep } = require('path')
    
    const proc = process.stdout.write.bind(process.stdout)
    const component = 'A-watcher';
    
    const onAdd = (path) => {
        // enqueue(`A: File ${path} has been added`)
        // proc(`A: File ${path} has been added`)
        // const action = {
        //     type: A_FETCH
        // }
        log.log(`A: File ${path} has been added`, DEBUG, component)
        // pubsock.send(['state', JSON.stringify(action)])

        const name = path.split(sep).pop()
        const format = name.split('.')[1]
        const id = parseInt(name.split('.')[0])      
        const action = {
            type: A_SUCCESS,
            videos: [{
                id,
                name,
                format,
                path
            }]
        }
        // console.log(JSON.stringify(action.videos))
        // log.log(`A: File ${path} has been changed`, DEBUG, component)   
        pubsock.send(['state', JSON.stringify(action)])
    }
    
    const onChange = (path) => {
        // enqueue(`A: File ${path} has been changed`)
        // proc(`A: File ${path} has been changed`) 
        // const name = path.split(sep).pop()
        // const format = name.split('.')[1]
        // const id = parseInt(name.split('.')[0])      
        // const action = {
        //     type: A_SUCCESS,
        //     videos: [{
        //         id,
        //         name,
        //         format,
        //         path
        //     }]
        // }
        // // console.log(JSON.stringify(action.videos))
        // log.log(`A: File ${path} has been changed`, DEBUG, component)   
        // pubsock.send(['state', JSON.stringify(action)])
    }
    
    const onDelete = (path) => {
        // enqueue(`A: File ${path} has been removed`)
        // proc(`A: File ${path} has been fucked`)
        const name = path.split(sep).pop()
        const format = name.split('.')[1]
        const id = parseInt(name.split('.')[0])
        log.log(`A: File ${path} has been deleted`, DEBUG, component)    
        // const action = {
        //     type: A_DELETE_SUCCESS,
        //     id
        // }
        // pubsock.send(['state', JSON.stringify(action)])       
    }
    
    watch.watch('./test/A',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js|gitignore)/ ,persistent: true })
    
    process.on('beforeExit', async () => {
        await watch.close(() => proc("EXITED"), ()  => proc("FUCK"))
    })
}

module.exports = A;