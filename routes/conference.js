const express = require('express');
const router = express.Router();

// all users connected to this endpoint
let clients = [];

router.ws('/', (ws) => {
  ws.on('message', (msg) => {
    const msgData = JSON.parse(msg);
    const users = [];
    let client;

    try {
      switch (msgData.type) {
        // New user joined
        case 'user-joined':
          /**
           * {
           *   username: users name,
           *   type: 'user-joined'
           * }
           */
          // send new users info to all other users
          clients.forEach((client) => {
            client.send(JSON.stringify({
              username: msgData.username,
              type: 'user-joined',
            }));
          });

          // send list of present users to new user
          clients.forEach((client) => {
            if (!client.connectTo) {
              users.push(client.username);
            }
          });
          ws.send(JSON.stringify({
            users: users,
            type: 'user-joined',
          }));

          // new user to list of all users
          ws.username = msgData.username;
          clients.push(ws);

          console.log('user-joined');
          break;

        // each user sends info about RTC peer that connects to another user in chat
        case 'video-ready':
          /**
           * {
           *   username: name of user ready to chat,
           *   connectTo: users name to which connect this RTC peer
           *   type: 'video-ready'
           * }
           */
          if (msgData.username && msgData.connectTo) {
            ws.username = msgData.username;
            ws.connectTo = msgData.connectTo;
            clients.push(ws);
          }

          // print present users
          clients.forEach((client) => {
            if (!client.connectTo) {
              console.log(client.username);
            }
          });
          break;

        // offer <-> answer exchange
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
          client = clients.find(client => client.username === msgData.to && client.connectTo === msgData.from);
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
          client = clients.find(client => client.username === msgData.to && client.connectTo === msgData.from);
          console.log('answer by ', msgData.from, 'for ', msgData.to);
          if (client) client.send(msg);
          break;

        default:
      }
    } catch (error) {
      console.log(error);
    }
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
              type: 'user-disconnected',
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
