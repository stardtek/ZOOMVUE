<template>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col">
        <me-camera username="Ta prav ti!!!"></me-camera>
      </div>
      <div class="col" v-for="user in users" :key="user.name">
        <you-camera v-bind:username="user.name" />
      </div>
    </div>
  </div>
</template>

<script>
import MeCamera from '../components/MeCamera.vue';
import YouCamera from '../components/YouCamera.vue';

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
    MeCamera,
    YouCamera,
  },
};
</script>

<style>
.container-fluid {
  background-color: #2c3e50;
}

</style>
