const A = () => {
    const watch = require('../stateWatch/index')
    const { log, DEBUG, WARNING } = require('./../dispatcher')
    
    const proc = process.stdout.write.bind(process.stdout)
    const component = 'A-watcher';
    
    const onAdd = (path) => {
        // enqueue(`A: File ${path} has been added`)
        // proc(`A: File ${path} has been added`)
        log.log(`A: File ${path} has been added`, DEBUG, component)
    }
    
    const onChange = (path) => {
        // enqueue(`A: File ${path} has been changed`)
        // proc(`A: File ${path} has been changed`)        
        log.log(`A: File ${path} has been changed`, DEBUG, component)   
    }
    
    const onDelete = (path) => {
        // enqueue(`A: File ${path} has been removed`)
        // proc(`A: File ${path} has been fucked`)
        log.log(`A: File ${path} has been deleted`, DEBUG, component)    
    }
    
    watch.watch('./A',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js|gitignore)/ ,persistent: true })
    
    process.on('beforeExit', async () => {
        await watch.close(() => proc("EXITED"), ()  => proc("FUCK"))
    })
}

module.exports = A;