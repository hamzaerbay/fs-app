const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3000, () => {
  console.log("server started on port 3000");
});

/** Begin websocket */
// we're going to use library ws
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  // everytime user connect
  const numClients = wss.clients.size;
  // we're console the num of clients on server console
  console.log("clients connected", numClients);

  // broadcast sends message to everybody connected. So send everybody to connected visitor count
  wss.broadcast(`Current visitors: ${numClients}`);

  // Error hanlding.
  if (ws.readyState == ws.OPEN) {
    ws.send("Welcome to my server");
  }
  ws.on("close", function close() {
    console.log("A Client has disconnetted");
    wss.broadcast(`Someone has disconnected! Current visitors: ${numClients}`);
  });
});
/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
wss.broadcast = function broadcast(data) {
  console.log("Broadcasting: ", data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
