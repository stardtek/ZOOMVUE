const express = require('express');
const router = express.Router();

// all users connected to this endpoint
let clients = [];

const userDisconnectedStatus = -1;

router.ws('/', (ws) => {
  /**
   * Expected message format
   *
   * {
   *   user: string,
   *   frame: string -> imgDataURL, users video frame data | -1 means user disconnected
   * }
   *
   */

  ws.on('message', (msg) => {
    let client;
    const msgData = JSON.parse(msg);
    try {
      switch (msgData.type) {
        // New users requests all other connected clients
        case 'get-all-users':
          /**
           * {
           *  type: 'get-all-users'
           * }
           */
          const users = [];
          clients.forEach((client) => users.push(client.username));
          ws.send(JSON.stringify({
            users: users,
            type: 'get-all-users-response',
          }));
          console.log('get-all-users req by');
          break;

        // First users just send something like "i am here let's go"
        case 'first-in':
          /**
           * {
           *   from: string - caller,
           *   type: 'first-in'
           * }
           */
          ws.username = msgData.from;
          clients.push(ws);
          break;

        // message redirect same in both cases
        case 'offer':
          /**
           * {
           *   from: string - caller,
           *   to: string - called,
           *   type: 'offer',
           *   description: RTC localDescription
           * }
           */
          client = clients.find(client => client.username === msgData.to);
          console.log('offer by ', msgData.from, 'for ', msgData.to);
          if (client) client.send(msg);
          break;
        case 'answer':
          /**
           * {
           *   from: string - caller,
           *   to: string - called,
           *   type: 'answer',
           *   description: RTC localDescription
           * }
           */
          client = clients.find(client => client.username === msgData.to);
          console.log('answer by ', msgData.from, 'for ', msgData.to);
          if (client) client.send(msg);
          break;

        default:
      }
    } catch (error) {
      console.log(error);
    }

    if (msgData.from) {
      const client = clients.find(client => client.username === msgData.from);
      if (!client) {
        ws.username = msgData.from;
        clients.push(ws);
      }
    }

    clients.forEach((client) => console.log(client.username));
  });

  ws.on('close', () => {
    const disconnectedClient = clients.indexOf(ws);
    if (disconnectedClient !== -1) {

      // send user disconnected status
      clients.forEach((client) => {
        if (client !== ws) {
          try {
            client.send(JSON.stringify({
              username: clients[disconnectedClient].username,
              frame: userDisconnectedStatus,
            }));
          } catch {
            console.log('Error: Tried to send message to disconnected client...');
          }
        }
      });

      clients.splice(disconnectedClient, 1);
      console.log('Client disconnected...');
    }
  });
});

module.exports = router;
