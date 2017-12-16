I do not understand how I reached this point
I in fact cannot believe everything went this well

- run `node index.js` right at the root of this folder (where this readme is) this starts chokidar to check folders for changes
- run `node index.js` at /store this starts subscriber to state changes
- run `node index.js` at /dispatcher this starts publisher for state, and subscriber for ws

TODO: ws publisher and handler method