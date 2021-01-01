const express = require('express');
const router = express.Router();
const messagesDB = require("../db/messages");
// all users connected to this endpoint
if (!global.privateChatClients) global.privateChatClients = [];

const userDisconnectedStatus = -1;

router.ws('/', (ws) => {
  // Add new client to Broadcast list
  global.privateChatClients.push(ws);

  ws.on('message', (msg) => {
    // broadcast frame to all connected clients
    messagesDB.save( JSON.parse(msg));
    global.privateChatClients.forEach((client) => {
      const msgData = JSON.parse(msg);
      console.log(msgData);
      if (!client.username) {
        // add username to each socket, so we can tell later which user disconnected
        if (msgData.from) {
          client.username = msgData.from;
          console.log(client.username+ " : "+msgData.message);
        }
      }
      try {
        if (client.bufferedAmount === 0 && msgData.from === client.username || msgData.to === client.username) {
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
    const disconectedClient = global.privateChatClients.indexOf(ws);
    if (disconectedClient !== -1) {

      // send user disconnected status
      global.privateChatClients.forEach((client) => {
        if (client !== ws) {
          try {
            client.send(JSON.stringify({
              disconected: true,
              username: global.privateChatClients[disconectedClient].username,
              frame: userDisconnectedStatus,
            }));
          } catch {
            console.log('Error: Tried to send message to disconnected client...');
          }
        }
      });

      global.privateChatClients.splice(disconectedClient, 1);
      console.log('Client disconnected...');
    }
  });
});

// WS ping-pong so we do not disconnect
setInterval(() => {
  global.privateChatClients.forEach((c) => {
    try {
      c.ping(() => {});
    } catch {}
  });
}, 1000);

module.exports = router;
