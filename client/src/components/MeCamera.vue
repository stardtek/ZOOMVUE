<template>
  <div class="card m-1">
    <video class="card-img-top" ref="camera" autoplay muted>No video available</video>
    <div class="card-body">
      <h4 class="card-title font-weight-bold">{{ username }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeCamera',

  props: [
    // your username
    /** @type {string} */
    'username',
  ],

  mounted() {
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then((stream) => {
        this.$refs.camera.srcObject = stream;
        this.$refs.camera.play();
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    }
  },
};
</script>

<style scoped>

video {
  max-width: 100%;
  height: auto;
}

</style>
