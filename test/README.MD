I do not understand how I reached this point
In fact, I cannot believe everything went this well

- run `node index.js` right at the root of this folder (where this readme is) this starts chokidar to check folders for changes, and publisher for state (this also starts a dummy request to get pictures)
- run `node index.js` at /store this starts subscriber to state changes
- run `node index.js` at /logger this starts the logger

TODO: ws publisher and handler method