const express = require('express');
const router = express.Router();

// all users connected to this endpoint
let clients = [];

const userDisconnectedStatus = -1;

router.ws('/', (ws) => {
  // Add new client to Broadcast list
  clients.push(ws);



  ws.on('message', (msg) => {
    // broadcast frame to all connected clients
    clients.forEach((client) => {

        try {
          if (client.bufferedAmount === 0) {
            client.send(msg);
          } else {
            console.log('WS overloaded, skipped this message');
          }
        } catch {
          console.log('Error: Tried to send message to disconnected client...');
        }
      if (!client.username) {
        // add username to each socket, so we can tell later which user disconnected
        const msgData = JSON.parse(msg);
        if (msgData.username) {
          client.username = msgData.username;
          console.log(client.username + " : "+msgData.message);
        }
      }
    });
  });

  ws.on('close', () => {
    const disconectedClient = clients.indexOf(ws);
    if (disconectedClient !== -1) {

      // send user disconnected status
      clients.forEach((client) => {
        if (client !== ws) {
          try {
            client.send(JSON.stringify({
              disconected: true,
              username: clients[disconectedClient].username,
              frame: userDisconnectedStatus,
            }));
          } catch {
            console.log('Error: Tried to send message to disconnected client...');
          }
        }
      });

      clients.splice(disconectedClient, 1);
      console.log('Client disconnected...');
    }
  });
});

module.exports = router;
