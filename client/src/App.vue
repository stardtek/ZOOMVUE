<template>
  <div id="nav">
    <router-link id="logo" to="/">
      <img src="@/assets/logo2.jpg" width="80" alt="LOGO"/></router-link>
    | <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/chat">Chat</router-link> |
    <router-link to="/private">private</router-link> |
    <router-link to="/conference">Conference</router-link> |
    <div v-if="logedStatus === false">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
    </div>

    <div v-if="logedStatus === true">
      <form @submit.prevent="logout">
        <button type="submit" >Logout</button>
      </form>
    </div>
  </div>
  <router-view>
  </router-view>
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
