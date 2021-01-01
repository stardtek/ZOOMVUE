const express = require('express');
const router = express.Router();
const messagesDB = require("../db/messages");
// all users connected to this endpoint
let clients = [];

const userDisconnectedStatus = -1;

router.ws('/', (ws) => {
  // Add new client to Broadcast list
  clients.push(ws);



  ws.on('message', (msg) => {
    // broadcast frame to all connected clients
    messagesDB.save( JSON.parse(msg));
    clients.forEach((client) => {
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
