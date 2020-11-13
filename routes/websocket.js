const express = require('express');
const router = express.Router();

router.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    console.log('Message received: ' + msg);
    ws.send(msg);
  });
});

module.exports = router;
