<template>
  <div>
    <h1 id="welcome">Welcome to Hogs sallon!</h1>
    <div>
      <hr />
      <img src="../assets/logo2.jpg" alt="" />
    </div>
  </div>
  <div class="camera">
    <Camera />
  </div>
</template>

<script>
/* eslint-env es6 */

// const API_URL = "http://localhost:4000/messages";

import Camera from '@/components/Camera.vue';

export default {
  name: 'home',
  components: {
    Camera,
  },
  data: () => ({
    welcome: 'Welcome to Hogs sallon!',
  }),

  mounted() {},
  methods: {},
};
</script>

<style>
img {
  max-width: 300px;
  height: auto;
}
</style>
