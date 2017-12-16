const watch = require('../stateWatch/index')

const proc = process.stdout.write.bind(process.stdout)
const log = console.log.bind(console)
const onAdd = (path) => {
    // log(`A: File ${path} has been added`)
    proc(`A: File ${path} has been added`)    
}

const onChange = (path) => {
    // log(`A: File ${path} has been changed`)
    proc(`A: File ${path} has been changed`)    
}

const onDelete = (path) => {
    // log(`A: File ${path} has been removed`)
    proc(`A: File ${path} has been fucked`)    
}

proc(`A: FUCK`)    

watch.watch('.',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js)/ ,persistent: true })

process.on('beforeExit', async () => {
    await watch.close(() => proc("EXITED"), ()  => proc("FUCK"))
})