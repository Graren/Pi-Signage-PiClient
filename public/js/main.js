const socket = io('http://localhost:8080', {transports: ['websocket']})
setTimeout(() => {
  socket.on('location', (data) => {
    window.location.replace(data.location)
  })
})
