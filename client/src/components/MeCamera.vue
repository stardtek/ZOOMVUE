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
          v-on:click="audioEnabled = !audioEnabled">
          <div class="mdc-button__ripple"></div>
          <div v-if="audioEnabled">
            <i class="material-icons mdc-button__icon" aria-hidden="true">mic</i>
          </div>
          <div v-else>
            <i class="material-icons mdc-button__icon" aria-hidden="true">mic_off</i>
          </div>
          <span class="mdc-button__label">Audio</span>
        </button>
        <button class="mdc-button mdc-button--raised m-3 p-4"
          v-on:click="videoEnabled = !videoEnabled">
          <div class="mdc-button__ripple"></div>
          <div v-if="videoEnabled">
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
  name: 'MeCamera',

  props: [
    'username',
    'wsSocket',
  ],

  data: () => ({
    videoEnabled: true,
    audioEnabled: true,
    camera: null,
    // wsSocket: null,
    cameraScream: null,
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

    // this.wsSocket = new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL);

    // Listen for messages
    // this.wsSocket.addEventListener('message', () => {
    //   // eslint-disable-next-line no-console
    //   console.log('Message to Me camera!!!');
    // });

    // Close connection
    this.wsSocket.addEventListener('close', () => {
      clearInterval(this.cameraScream);
      // eslint-disable-next-line no-console
      console.log('WebSocket is closed!!!');
    });

    // set Camera stream to server interval
    this.cameraScream = setInterval(() => {
      /**
       * Expected message format
       *
       * {
       *   username: string,
       *   frame: string -> imgDataURL, users video frame data
       * }
       *
       */
      const data = JSON.stringify({
        username: this.username,
        frame: this.captureVideo(),
      });
      // only send if WS is overloaded
      if (this.wsSocket.bufferedAmount === 0) {
        this.wsSocket.send(data);
      } else {
        // eslint-disable-next-line no-console
        console.log('WS overloaded');
      }
      // TODO this uses a lot of resources, probably need some sort of regulation
    }, 250);
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
