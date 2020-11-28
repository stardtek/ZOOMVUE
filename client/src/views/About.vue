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

    <div class="about">
      <h1>This is an about page</h1>
      <div>
        <p>Hogs sallon is an internet caffe for text and voice chat.</p>
        <h1 v-if="logedStatus == true">{{username}}</h1>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-env es6 */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

export default {
  name: 'about',
  data: () => ({
    username: '',
  }),
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
  mounted() {
    if (localStorage.getItem('user')) {
      this.username = localStorage.getItem('user');
    }
  },
  computed: {
    logedStatus: () => {
      if (localStorage.getItem('user')) {
        return true;
      }
      return false;
    },
    logedName: () => {
      // console.log('pride sm');
      if (localStorage.getItem('user')) {
        return localStorage.getItem('user');
      }

      // eslint-disable-next-line prefer-template
      const rand = 'Random cunt ' + Math.floor(Math.random() * 100);
      return rand;
    },
  },
};
</script>
