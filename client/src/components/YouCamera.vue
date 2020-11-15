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
    'frame',
  ],

  data: () => ({
    video_enabled: true,
    audio_enabled: true,
  }),
};
</script>

<style scoped>

img {
  max-width: 100%;
  height: auto;
}

</style>
