const { fork, spawn } = require('child_process');

fork('./test/store/index.js');
fork('./test/logger/index.js');
fork('./test/index.js');