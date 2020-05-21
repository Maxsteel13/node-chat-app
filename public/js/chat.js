const socket = io();
const chatInput = document.getElementById("chatInput");
const btnSend = document.getElementById("btnSend");
const dvMessageLog = document.getElementById("dvMessageLog");
const sendLocation = document.getElementById("send-location");

const addPara = (message) => {
  const p = document.createElement("p");
  p.innerText = message;
  dvMessageLog.appendChild(p);
};

socket.on("message", (message) => {
  addPara(message);
});

btnSend.addEventListener("click", (e) => {
  e.preventDefault();
  if (chatInput.value) {
    socket.emit("sendMessage", chatInput.value, (errorMsg) => {
      if (errorMsg) {
        addPara(`Message Undelivered: (${errorMsg})`);
      } else {
        console.log("the message was delivered!");
      }
    });
    chatInput.value = "";
  }
});

sendLocation.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("sending location", position);
      const { latitude, longitude } = position.coords;
      socket.emit(
        "sendLocation",
        { latitude, longitude },
        (errorMsg, message) => {
          if (!errorMsg) {
            addPara(`Location status: (${message})`);
          }
        }
      );
    });
  }
});

// const incr = document.getElementById("increment");
// const p = document.getElementById("value");

// socket.on("clientConnected", (greeting) => {
//   console.log("welcome message received", greeting);
//   p.textContent = greeting;
// });

// incr.addEventListener("click", function () {
//   console.log("clicked");
//   socket.emit("increment");
// });
