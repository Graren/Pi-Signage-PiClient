const watch = require('../stateWatch/index')
const { spawn } = require('child_process')
const fs = require('fs');

const destination = `../A`

const proc = process.stdout.write.bind(process.stdout)
const log = console.log.bind(console)

const onAdd = (path) => {
    // log(`C: File ${path} has been added`)
    proc(`C: File ${path} has been added`)    
    fs.createReadStream(path).pipe(fs.createWriteStream(`${destination}/${path}`));
}

const onChange = (path) => {
    // log(`C: File ${path} has been changed`)
    proc(`C: File ${path} has been changed`)    
}

const onDelete = (path) => {
    // log(`C: File ${path} has been removed`)
    proc(`C: File ${path} has been fucked`)    
}

proc(`A: FUCK`)    

watch.watch('.',onAdd,onChange,onDelete, { ignored: /\S+\.(MD|js)/ ,persistent: true })

process.on('beforeExit', async () => {
    await watch.close(() => proc("EXITED"), ()  => proc("FUCK"))
})