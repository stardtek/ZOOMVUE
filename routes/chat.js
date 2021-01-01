const express = require('express');
const router = express.Router();

// all users connected to this endpoint
if (!global.chatClients) global.chatClients = [];

const userDisconnectedStatus = -1;

router.ws('/', (ws) => {
  // Add new client to Broadcast list
  global.chatClients.push(ws);

  ws.on('message', (msg) => {
    // broadcast frame to all connected clients
    global.chatClients.forEach((client) => {
      const msgData = JSON.parse(msg);
      if (!client.username) {
        // add username to each socket, so we can tell later which user disconnected
        if (msgData.username) {
          client.username = msgData.username;
          client.group = msgData.group;
          console.log(client.username+ " " + client.group + " : "+msgData.message);
        }
      }
      try {
        if (client.bufferedAmount === 0 && msgData.group === client.group) {
          client.send(msg);
        } else {
          console.log('WS overloaded, skipped this message');
        }
      } catch {
        console.log('Error: Tried to send message to disconnected client...');
      }
    });
  });

  ws.on('close', () => {
    const disconectedClient = global.chatClients.indexOf(ws);
    if (disconectedClient !== -1) {

      // send user disconnected status
      global.chatClients.forEach((client) => {
        if (client !== ws) {
          try {
            client.send(JSON.stringify({
              disconected: true,
              username: global.chatClients[disconectedClient].username,
              frame: userDisconnectedStatus,
            }));
          } catch {
            console.log('Error: Tried to send message to disconnected client...');
          }
        }
      });

      global.chatClients.splice(disconectedClient, 1);
      console.log('Client disconnected...');
    }
  });
});

// WS ping-pong so we do not disconnect
setInterval(() => {
  global.chatClients.forEach((c) => {
    c.ping(() => {});
  });
}, 1000);

module.exports = router;
