<template>
  <div class="mdc-card m-3">
    <div class="row">
      <div class="col">
        <h1 class="p-3">{{ username }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <video ref="camera" autoplay>
          Video ni na voljo
        </video>
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
// const userDisconnectedStatus = -1;

export default {
  name: 'MeCamera',

  props: [
    'username',
  ],

  data: () => ({
    video_enabled: true,
    audio_enabled: true,
    camera: null,
    ws_socket: null,
    ws_socket_url: 'ws://192.168.1.14:4000/conference',
    camera_scream: null,
  }),

  mounted() {
    // Grab elements, create settings, etc.
    this.camera = this.$refs.camera;

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // video.src = window.URL.createObjectURL(stream);
          this.camera.srcObject = stream;
          this.camera.play();
        });
    }

    this.ws_socket = new WebSocket(this.ws_socket_url);

    // Listen for messages
    this.ws_socket.addEventListener('message', () => {
      // eslint-disable-next-line no-console
      console.log('Message to Me camera!!!');
    });

    // Close connection
    this.ws_socket.addEventListener('close', () => {
      clearInterval(this.camera_scream);
      // eslint-disable-next-line no-console
      console.log('WebSocket is closed!!!');
    });

    // set Camera stream to server interval
    this.camera_scream = setInterval(() => {
      const data = JSON.stringify({
        username: this.username,
        frame: this.captureVideo(),
      });
      this.ws_socket.send(data);
      // TODO this uses a lot of resources, probably need some sort of regulation
    }, 200);
  },

  methods: {
    captureVideo() {
      const canvas = document.createElement('canvas');
      canvas.width = this.$refs.camera.videoWidth;
      canvas.height = this.$refs.camera.videoHeight;
      const canvasContext = canvas.getContext('2d');
      canvasContext.drawImage(this.$refs.camera, 0, 0);
      return canvas.toDataURL('image/png');
    },
  },
};
</script>

<style scoped>

video {
  max-width: 100%;
  height: auto;
}

</style>
