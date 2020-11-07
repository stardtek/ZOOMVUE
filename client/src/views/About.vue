<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <p>Hogs sallon is an internet caffe for text and voice chat.</p>
      <h1 v-if="logedIn == true">{{username}}</h1>
    </div>
  </div>
</template>
<script>
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

export default {
  name: "about",
  data: () => ({
    username: "",
  }),
  methods: {
  },
  mounted() {
    if (localStorage.getItem("user")) {
      this.username = localStorage.getItem("user");
    }
  },
  computed: {
    logedIn: () => {
      if (localStorage.getItem("user")) {
        return true;
      }
      return false;
    },
  },
};
</script>
