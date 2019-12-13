const rootSocket = (io)=> {
    
    //connect
    io.sockets.on('connection', function (socket) {
        console.log("New Client connected")

      socket.on('postingData', function (data) {
        socket.broadcast.emit("postedData", { num: data })
      });

      socket.on('deletingData', function (data) {
        socket.broadcast.emit("deletedData", { num: data })
      });

      socket.on('patchingData', function(data) {
        socket.broadcast.emit("patchedData", { num: data })
      })

    });
  }

module.exports = rootSocket;