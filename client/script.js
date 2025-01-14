const joinRoomButton = document.getElementById("room-button");
const roomInput = document.getElementById("room-input");
const messageInput = document.getElementById("message-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  displayMessage(`You are connected with id: ${socket.id} `);
});

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

//nhắn tin riêng với nhóm chat
joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room);
});

function displayMessage(message, type) {
  const div = document.createElement("div");

  div.textContent = message;
  div.classList.add("message", type);

  document.getElementById("message-container").appendChild(div);
}
