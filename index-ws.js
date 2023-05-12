const express = require("express");
const server = require("http").createServer();
const app = express();
/** Exercise
 * Create a websocket server
 * log the visitor count and broadcast the number to clients
 */
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3000, () => {
  console.log("server started on port 3000");
});

// Signal interrupt. Command + C
process.on("SIGINT", () => {
  // Close every single websocket connection
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});
/** Begin websocket */
// we're going to use ws
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  // everytime user connect
  const numClients = wss.clients.size;
  // we're console the num of clients on server console
  console.log("Clients connected", numClients);

  // Broadcast sends message to everybody connected. So send everybody to connected visitor count
  wss.broadcast(`Current visitors count: ${numClients}`);

  // TODO: Error hanlding.
  if (ws.readyState == ws.OPEN) {
    ws.send("Welcome to my server");
  }
  db.run(`
    INSERT INTO visitors (count, time)
    VALUES(${numClients}, datetime('now'))
  `);
  ws.on("close", function close() {
    console.log("A Client has disconnected");
    wss.broadcast(
      `Someone has disconnected! Current visitor count: ${numClients}`
    );
  });
});

/**
 * Broadcast data to all connected clients
 */
wss.broadcast = function broadcast(data) {
  console.log("Broadcasting: ", data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
/** End websocket */

/** Begin database */
/** Exercise
 * Create a visitors table
 *  Create a column named count
 *  Create a column named time
 * On websocket connection, Save current visitor count into the table
 */
const sqlite = require("sqlite3");

const db = new sqlite.Database(":memory:"); // it will gone when restart the server
// const db = new sqlite.Database('./fsApp.db'); to write in file
db.serialize(() => {
  // setup the database before run the queries
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Shutting down db");
  db.close();
}
/** End database */
