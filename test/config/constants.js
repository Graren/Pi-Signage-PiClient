module.exports = {
  wsPort: 3024, // websocketPublisherPort
  stPort: 3021, // statePublisherPort
  logPort: 3023, // logPublisherPort
  dpSock: 3027, // dispatcherSock
  stSock: 3026, // storeSock
  wbPort: 3025,
  levels: {
    DEBUG: 1,
    WARNING: 2,
    ERROR: 3
  },
  DELETE: 'DELETE',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  CHANGE_PLAYLIST: 'CHANGE_PLAYLIST',
  DELETE_PLAYLIST: 'DELETE_PLAYLIST',
  COMPARE_PLAYLIST: 'COMPARE_PLAYLIST'
}