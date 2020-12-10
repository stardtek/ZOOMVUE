<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <p>Hogs sallon is an internet caffe for text and voice chat.</p>
      <h1 v-if="logedStatus === true">{{username}}</h1>
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
