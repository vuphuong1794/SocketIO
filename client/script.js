const joinRoomButton = document.getElementById("room-button");
const roomInput = document.getElementById("room-input");
const messageInput = document.getElementById("message-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000");
const userSocket = io("http://localhost:3000/user", {auth: {token: "Test"}});

socket.on("connect", () => {
  displayMessage(`You are connected with id: ${socket.id} `);
});

userSocket.on("connect_error", error => {
  displayMessage(error);
})

socket.on("receive-message", (message) => {
  displayMessage(message, "received");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === "") return;

  socket.emit("send-message", message, room);

  displayMessage(message, "sent");

  messageInput.value = "";
});

//Group chat
joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, message => {
    displayMessage(message, "received");
  });
});

function displayMessage(message, type) {
  const div = document.createElement("div");

  div.textContent = message;
  div.classList.add("message", type);

  document.getElementById("message-container").appendChild(div);
}

let count = 0;
setInterval(() => {
  socket.volatile.emit('ping', ++count);
}, 1000);

document.addEventListener('keydown', (e) => {
  if(e.target.matches('input')) return;

  if(e.key === 'c') socket.connect();
  if(e.key === 'd') socket.disconnect();
});