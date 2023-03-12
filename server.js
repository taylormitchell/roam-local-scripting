import fs from "fs";
import path from "path";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";

const scriptsPath = path.resolve("scripts");

async function main() {
  const openSockets = new Set();
  console.log("Starting server...");
  const server = new WebSocketServer({ port: 8080 });
  server.on("connection", (socket) => {
    console.log("A roam client has connected to the server!");
    openSockets.add(socket);

    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);
      socket.send(JSON.stringify({ message: `You sent: ${message}` }));
    });

    socket.on("close", () => {
      console.log("A client has disconnected from the server!");
      openSockets.delete(socket);
    });
  });

  chokidar.watch(scriptsPath, { ignoreInitial: true }).on("all", (event, path) => {
    if (!path.endsWith(".js")) return;
    console.log(`Script ${path} has been ${event}`);
    const content = fs.readFileSync(path, "utf8");
    openSockets.forEach((socket) => {
      console.log(`Sending script ${path} to client`);
      socket.send(
        JSON.stringify({
          path,
          content,
        })
      );
    });
  });
}

main();
