const socket = require("socket.io").Server;
let io = null;

class Socket {
  #server;

  setServer(server) {
    this.#server = server;
  }

  createConnection() {
    io = new socket(this.#server, { cors: true }); // setting up socket connection

    io.on("connection", (socket) => {
      console.log(`socketid ${socket.id} is now connected`);

      // socket.on("sendToServer", (msg) => {
      //   console.log("I am the server, i have a message from the client");
      //   console.log(msg.msg);
      // });

      socket.on("disconnect", () => {
        console.log(`socketid ${socket.id} is now disconnected`);
      });
    });
  }

  getIo() {
    return io;
  }
}

module.exports.socket = new Socket();
