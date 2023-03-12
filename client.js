var socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", (event) => {
  console.log("Connection to server established!");
  socket.send("Hello server!");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log("Received message from server: ", data.message);
  if (data.content && data.path) {
    console.log("Received and running script: ", data.path);
    eval(data.content);
  }
});

socket.addEventListener("close", (event) => {
  console.log("Connection to server closed!");
});
