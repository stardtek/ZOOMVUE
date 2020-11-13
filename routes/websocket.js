const express = require('express');
const router = express.Router();

// all users connected to this endpoint
let clients = [];

router.ws('/', (ws) => {
  // Add new client to Broadcast list
  clients.push(ws);

  ws.on('message', (msg) => {
    // broadcast frame to all connected clients
    clients.forEach((client) => {
      // don't send users own video back to him
      if (client !== ws) {
        client.send(msg);
      }
    });
  });

  ws.on('close', () => {
    const disconectedClient = clients.indexOf(ws);
    clients.splice(disconectedClient, 1);
    console.log('Client disconnected!!!');
  });
});

module.exports = router;
