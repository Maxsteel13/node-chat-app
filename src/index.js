const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const publicDirPath = path.join(__dirname, "../public");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// let count = 0;

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", "a new user has joined");

  socket.on("sendMessage", (message, callback) => {
    console.log("message received", message);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      console.log("Profane word found!");
      return callback("Profanity is not allowed");
    }

    io.emit("message", message);
    callback();
  });

  socket.on("disconnect", () => {
    console.log("someone disconnected");
    io.emit("message", "a user has left!");
  });

  socket.on("sendLocation", (location, ackCallback) => {
    let errorMsg;
    console.log("send location received", location);
    socket.broadcast.emit(
      "locationMessage",
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );

    ackCallback(errorMsg, "Location delivered!");
  });

  // socket.on("increment", () => {
  //   count++;
  //   //socket.emit("countUpdated", count);
  //   io.emit("countUpdated", count);
  // });
});

server.listen(process.env.PORT, () => {
  console.log("Server started at port", process.env.PORT);
});
