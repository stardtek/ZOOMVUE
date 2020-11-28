<template>
  <div>

    <div id="nav">
        <router-link id="logo" to="/">
        <img src="@/assets/logo2.jpg" width="80" alt="LOGO"/></router-link>
        | <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/chat">Chat</router-link> |
        <div v-if="logedStatus == false">
        <router-link to="/login">Login</router-link> |
        <router-link to="/register">Register</router-link> |
    </div>

      <div v-if="logedStatus == true">
        <form @submit.prevent="logout">
          <button type="submit" >Logout</button>
      </form>
      </div>
    </div>
    <h1 id="welcome">Welcome to Hogs sallon!</h1>
    <div>
      <hr />
      <img src="../assets/logo2.jpg" alt="" />
    </div>
  </div>
</template>

<script>
/* eslint-env es6 */

// const API_URL = "http://localhost:4000/messages";

export default {
  name: 'home',
  data: () => ({
    welcome: 'Welcome to Hogs sallon!',
  }),

  mounted() {},
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
  computed: {
    logedStatus: () => {
      if (localStorage.getItem('user')) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style>
img {
  max-width: 300px;
  height: auto;
}
</style>
