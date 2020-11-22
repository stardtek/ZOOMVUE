<template>
  <div class="mdc-card m-3">
    <div class="row">
      <div class="col">
        <h1 class="p-3">{{ username }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <img ref="camera" v-bind:src="frame">
        <video ref="video"></video>
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
  name: 'YouCamera',

  props: [
    'username',
    'frame',
    'rtc',
  ],

  data: () => ({
    videoEnabled: true,
    audioEnabled: true,
  }),

  mounted() {
    this.$refs.video.srcObject = this.rtc;
  },
};
</script>

<style scoped>

img {
  max-width: 100%;
  height: auto;
}

</style>
