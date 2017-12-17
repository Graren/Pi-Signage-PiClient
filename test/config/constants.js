const websocketPublisherPort = 3024
const statePublisherPort = 3021
const logPublisherPort = 3023
const levels = {
    DEBUG: 1,
    WARNING: 2,
    ERROR: 3
}

module.exports = {
    wsPort: websocketPublisherPort,
    stPort: statePublisherPort,
    logPort: logPublisherPort,
    levels
}