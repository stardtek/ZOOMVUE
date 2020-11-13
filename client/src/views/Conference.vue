<template>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col" v-for="user in users" :key="user.name">
        <camera v-bind:username="user.name" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button class="mdc-button mdc-button--raised" v-on:click="send">
          <span class="mdc-button__label">Send 'hello' via WS</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Camera from '../components/Camera.vue';

export default {
  name: 'conference',

  data: () => ({
    users: [
      { name: 'Rok Šerak' },
      { name: 'Žan Ostrožnik' },
      { name: 'Miha Gošte' },
      { name: 'Gašper Habjan' },
    ],
    ws_socket: null,
    ws_socket_url: 'ws://localhost:4000/websocket',
  }),

  components: {
    Camera,
  },

  mounted() {
    this.ws_socket = new WebSocket(this.ws_socket_url);

    // Connection opened
    this.ws_socket.addEventListener('open', (event) => {
      // eslint-disable-next-line no-console
      console.log(event.data);
      this.ws_socket.send('Hello Server!');
    });

    // Listen for messages
    this.ws_socket.addEventListener('message', (event) => {
      // eslint-disable-next-line no-console
      console.log('Message from server ', event.data);
    });
  },

  methods: {
    send() {
      this.ws_socket.send('Hello Server!');
    },
  },
};
</script>

<style>
.container-fluid {
  background-color: #2c3e50;
}

</style>
