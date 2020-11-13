<template>
  <div class="mdc-card m-3">
    <div class="row">
      <div class="col">
        <h1 class="p-3">{{ username }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <img ref="camera">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button class="mdc-button mdc-button--raised m-3 p-4"
          v-on:click="audio_enabled = !audio_enabled">
          <div class="mdc-button__ripple"></div>
          <div v-if="audio_enabled">
            <i class="material-icons mdc-button__icon" aria-hidden="true">mic</i>
          </div>
          <div v-else>
            <i class="material-icons mdc-button__icon" aria-hidden="true">mic_off</i>
          </div>
          <span class="mdc-button__label">Audio</span>
        </button>
        <button class="mdc-button mdc-button--raised m-3 p-4"
          v-on:click="video_enabled = !video_enabled">
          <div class="mdc-button__ripple"></div>
          <div v-if="video_enabled">
            <i class="material-icons mdc-button__icon" aria-hidden="true">videocam</i>
          </div>
          <div v-else>
            <i class="material-icons mdc-button__icon" aria-hidden="true">videocam_off</i>
          </div>
          <span class="mdc-button__label">Video</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YouCamera',

  props: [
    'username',
  ],

  data: () => ({
    video_enabled: true,
    audio_enabled: true,
    ws_socket: null,
    ws_socket_url: 'ws://localhost:4000/websocket',
  }),

  mounted() {
    this.ws_socket = new WebSocket(this.ws_socket_url);

    // Connection opened
    this.ws_socket.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      console.log('Websocket opened!!!');
    });

    // Listen for messages
    this.ws_socket.addEventListener('message', (event) => {
      // Load users video frame
      this.$refs.camera.src = event.data;
    });
  },
};
</script>

<style scoped>

img {
  max-width: 100%;
  height: auto;
}

</style>
