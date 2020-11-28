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
    <div class="container-fluid">
        <div class="col" v-if="wsSocket !== null">
          <chatWin v-bind:username="logedName" v-bind:wsSocket="wsSocket"></chatWin>
        </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable max-len */

import chatWin from '../components/TextWindow.vue';

const userDisconnectedStatus = -1;

export default {
  name: 'chat',

  data: () => ({

    users: [],
    wsSocket: null,
  }),

  components: {
    chatWin,

  },

  mounted() {
    this.wsSocket = new WebSocket(process.env.VUE_APP_CHAT_WS_URL);

    // Connection opened
    this.wsSocket.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      console.log('Websocket opened from chat!!!');
    });
    this.wsSocket.addEventListener('message', (event) => {
      // Load users video frame
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(event.data);

      // ignore empty messages or messages with missing data
      if (!data || !data.username || !data.frame) return;

      const userIndex = this.users.findIndex((user) => user.username === data.username);

      if (data.frame === userDisconnectedStatus && userIndex !== -1) {
        // remove disconnected user from grid
        this.users.splice(userIndex, 1);
      } else if (userIndex === -1) {
        // new user joined
        this.users.push(data);
      } else {
        // refresh users image
        // this.users[userIndex].frame = data.frame;
        console.log(data);
      }
    });
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

      const rand = 'Random cunt ' + Math.floor(Math.random() * 100);
      return rand;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.container-fluid {
  background-color: #2c3e50;
}

</style>
