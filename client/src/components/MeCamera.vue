<template>
  <div>
    <video ref="camera" autoplay muted></video>
  </div>
</template>

<script>
export default {
  name: 'MeCamera',

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
