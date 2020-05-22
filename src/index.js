const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const publicDirPath = path.join(__dirname, "../public");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// let count = 0;
app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  //socket.broadcast.emit("message", generateMessage("a new user has joined"));

  socket.on("join", ({ username, room } = null, ackCallback) => {
    const result = addUser({ id: socket.id, username, room });
    if (result.error) {
      return ackCallback(result.error);
    }

    socket.join(result.room);
    socket.emit("message", generateMessage("Welcome"));
    socket.broadcast
      .to(result.room)
      .emit("message", generateMessage(`${result.username} has joined!`));

    io.to(result.room).emit("roomData", {
      room: result.room,
      users: getUsersInRoom(result.room),
    });
    ackCallback();
  });

  socket.on("sendMessage", (message, callback) => {
    console.log("message received", message);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      console.log("Profane word found!");
      return callback("Profanity is not allowed");
    }

    const foundUser = getUser(socket.id);
    if (foundUser) {
      io.to(foundUser.room).emit(
        "message",
        generateMessage(message, foundUser.username)
      );
      callback();
    }
  });

  socket.on("disconnect", () => {
    const foundUser = removeUser(socket.id);
    if (foundUser) {
      io.to(foundUser.room).emit(
        "message",
        generateMessage(`${foundUser.username} has left!`)
      );
      io.to(foundUser.room).emit("roomData", {
        room: foundUser.room,
        users: getUsersInRoom(foundUser.room),
      });
    }
  });

  socket.on("sendLocation", (location, ackCallback) => {
    let errorMsg;
    console.log("send location received", location);
    const foundUser = getUser(socket.id);
    if (foundUser) {
      socket
        .to(foundUser.room)
        .broadcast.emit(
          "locationMessage",
          generateLocationMessage(
            `https://google.com/maps?q=${location.latitude},${location.longitude}`,
            foundUser.username
          )
        );

      ackCallback(errorMsg, "Location delivered!");
    }
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
