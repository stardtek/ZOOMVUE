<template>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col">
        <me-camera v-bind:username="your_name"></me-camera>
      </div>
      <div class="col" v-for="user in users" :key="user.username">
        <you-camera v-bind:username="user.username" v-bind:frame="user.frame" />
        <div>{{ user.frame }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import MeCamera from '../components/MeCamera.vue';
import YouCamera from '../components/YouCamera.vue';

const userDisconnectedStatus = -1;

export default {
  name: 'conference',

  data: () => ({
    // TODO get username from session
    your_name: Math.random() * 1000,
    users: [],
    ws_socket: null,
    ws_socket_url: 'ws://192.168.1.14:4000/conference',
  }),

  components: {
    MeCamera,
    YouCamera,
  },

  mounted() {
    this.ws_socket = new WebSocket(this.ws_socket_url);

    // Connection opened
    this.ws_socket.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      console.log('Websocket opened from conference!!!');
    });

    // Listen for messages
    this.ws_socket.addEventListener('message', (event) => {
      // Load users video frame
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(event.data);

      // ignore empty messages
      if (!data || !data.username || !data.frame) return;

      const userIndex = this.users.findIndex((user) => user.username === data.username);

      if (data.frame === userDisconnectedStatus && userIndex !== -1) {
        // remove disconnected user from grid
        this.users.splice(userIndex, 1);
      } else if (userIndex === -1) {
        // new user joined
        this.users.push(data);
      } else {
        // refresh users image
        this.users[userIndex].frame = data.frame;
      }
    });
  },
};
</script>

<style>
.container-fluid {
  background-color: #2c3e50;
}

</style>
