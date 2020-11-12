<template>
  <div class="mdc-card m-3">
    <div class="row">
      <div class="col">
        <h1 class="p-3">{{ username }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <video ref="userVideo" autoplay>
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
export default {
  name: 'Camera',

  props: [
    'username',
  ],

  data: () => ({
    video_enabled: true,
    audio_enabled: true,
  }),

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

video {
  max-width: 100%;
  height: auto;
}

</style>
