<template>
  <router-view>
  </router-view >
</template>
<script>
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */

export default {
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
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  --mdc-theme-primary: #2c3e50;
  --mdc-theme-on-primary: #FFFAFA;
}
#logo {
  float: left;
}
#nav {
  padding: 30px;
  border: #2c3e50;
  border-width: 2px;
  border-style: double;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
