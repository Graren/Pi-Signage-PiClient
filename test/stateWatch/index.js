var chokidar = require('chokidar');

const state = {};

const w = (dir = '.', config = { ignored: /node_modules\// ,persistent: true }) => {
    return chokidar.watch(dir, config);
}


const watch = (dir, onAdd, onChange, onDelete, config) => {
    state.watcher = w(dir, config);
    state.watcher
    .on('add', onAdd)
    .on('change', onChange)
    .on('unlink', onDelete);
}

const close = (cb,err) => {
    state.watcher.close()
    .then(cb)
    .catch(err)
}

// const onAdd = (path) => {
//     console.log(`File ${path} has been added`)
// }

// const onChange = (path) => {
//     console.log(`File ${path} has been changed`)
// }

// const onDelete = (path) => {
//     console.log(`File ${path} has been removed`)
// }

module.exports = {
    watch,
    close
};