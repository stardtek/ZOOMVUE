<template>
  <div>
    <h1 class="p-3">Hello there</h1>
    <div class="camera">
      <video ref="userVideo" width="640" height="480" autoplay></video>
      <video ref="friendVideo" width="640" height="480" autoplay></video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Camera',
  mounted() {
    // Grab elements, create settings, etc.
    const video = this.$refs.userVideo;

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
          video.play();
        });
    }
  },
};
</script>

<style scoped>

</style>
