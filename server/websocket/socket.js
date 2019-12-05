const rootSocket = (io)=> {
    
    //connect
    io.sockets.on('connection', function (socket) {
        console.log("New Client connected")

    //submithouse points
      socket.on('incomingData', function (data) {
        socket.broadcast.emit("outgoingData", { num: data })
      });

    //patchHousePoints

    //deleteHousePoints



    });
  }
module.exports = rootSocket;