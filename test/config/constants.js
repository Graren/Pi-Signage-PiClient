const websocketPublisherPort = 3024
const statePublisherPort = 3021
const logPublisherPort = 3023
const levels = {
    DEBUG: 1,
    WARNING: 2,
    ERROR: 3
}

const DELETE = 'DELETE'
const ADD = 'ADD'
const CHANGE_PLAYLIST = 'CHANGE_PLAYLIST'
const DELETE_PLAYLIST = 'DELETE_PLAYLIST'

module.exports = {
    wsPort: websocketPublisherPort,
    stPort: statePublisherPort,
    logPort: logPublisherPort,
    levels,
    DELETE,
    ADD,
    CHANGE_PLAYLIST,
    DELETE_PLAYLIST
}