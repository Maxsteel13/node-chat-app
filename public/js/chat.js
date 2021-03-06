const socket = io();
const chatInput = document.getElementById("chatInput");
const btnSend = document.getElementById("btnSend");
const dvMessageLog = document.getElementById("dvMessageLog");
const sendLocation = document.getElementById("send-location");
const sidebar = document.querySelector(".chat__sidebar");

//Templates
const messageTemplate = document.getElementById("message-template");
const locationTemplate = document.getElementById("location-template");
const sidebarTemplate = document.getElementById("sidebar-template");

//Query
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

const addPara = (obj) => {
  // const p = document.createElement("p");
  // p.innerText = message;
  // dvMessageLog.appendChild(p);
  console.log(obj);
  const { text: message, createdAt, username } = obj;
  const html = Mustache.render(messageTemplate.innerHTML, {
    message,
    createdAt: moment(createdAt).format("h:mm a"),
    username,
  });
  dvMessageLog.insertAdjacentHTML("beforeend", html);
};

const addLocationPara = (obj) => {
  const { url: locationUrl, createdAt, username } = obj;

  const html = Mustache.render(locationTemplate.innerHTML, {
    locationUrl,
    createdAt: moment(createdAt).format("h:mm a"),
    username,
  });
  console.log("locationUrl", locationUrl);
  dvMessageLog.insertAdjacentHTML("beforeend", html);
};

socket.on("message", (message) => {
  addPara(message);
});

socket.on("locationMessage", (message) => {
  console.log("locationMessage", message);
  addLocationPara(message);
});

socket.on("roomData", (obj) => {
  const html = Mustache.render(sidebarTemplate.innerHTML, obj);
  sidebar.innerHTML = html;
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
            addPara({
              text: `Location status: (${message})`,
              createdAt: new Date().getTime(),
              username: "Admin",
            });
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
