<template>
  <router-view>
    <h1>hahahah</h1>
  </router-view>
</template>
<script>
// import About from './views/About.vue';
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */

export default {
  components: { },
  name: "login",
  data: () => ({
    error: "",

    loginData: {
      username: "",
      password: "",
    },
  }),

  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$forceUpdate();
      this.$root.$forceUpdate();
      // this.$router.push("/login");
    },

  },
  computed: {
    logedStatus: () => {
      if (localStorage.getItem("user")) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="scss">
$orange: #FF7F50;
$gray: #2C3E50;
$green: #556B2F;
$white: #FFFAFA;
$smoke-white: #F5F5F5;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $gray;
  min-height: 100vh;
  padding: 0 0 40px;
  position: relative;
}

.navbar {
  background-color: $orange;
}

.navbar-toggler {
  color: $gray;
}

footer {
  width: 100%;
  background-color: $orange;
  bottom: 0;
  height: 40px;
  left: 0;
  padding-top: 8px;
  position: absolute;
}

.btn-green {
  background-color: $green;
  color: $white;
  font-weight: bold;
  font-size: medium;
}

.btn-smoke {
  background-color: $smoke-white;
  font-weight: bold;
}

.card {
  background-color: $smoke-white;
}

.link-gray {
  color: $gray;
  font-size: larger;
}

.link-smoke {
  color: $smoke-white;
  font-size: larger;
}

</style>
