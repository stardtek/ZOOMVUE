<template>
  <div>
    <h1 id="welcome">Welcome to Hogs sallon!</h1>
    <div>
      <hr />
      <img src="../assets/logo2.jpg" alt="" />
    </div>
  </div>
</template>

<script>
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */

// const API_URL = "http://localhost:4000/messages";

export default {
  name: "home",
  data: () => ({
    welcome: "Welcome to Hogs sallon!",
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
