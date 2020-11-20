<template>
  <div class="container-fluid">
    <div id="nav">
      <router-link id="logo" to="/">
        <img src="@/assets/logo2_1.png" width="80" alt="LOGO"/></router-link>
      | <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <div v-if="logedStatus == false">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      </div>
      <div v-if="logedStatus == true">
        <form @submit.prevent="logout">
          <button type="submit" >Logout</button>
          <router-link to="/conference">Conference</router-link> |
      </form>
      </div>

    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col" v-if="wsSocket !== null">
        <me-camera v-bind:username="yourName" v-bind:wsSocket="wsSocket"></me-camera>
      </div>
      <div class="col" v-for="user in users" :key="user.username">
        <you-camera v-bind:username="user.username" v-bind:frame="user.frame" />
      </div>
    </div>
  </div>
</template>

<script>
import MeCamera from '../components/MeCamera.vue';
import YouCamera from '../components/YouCamera.vue';

const userDisconnectedStatus = -1;

export default {
  name: 'conference',

  data: () => ({
    // TODO get username from session

    yourName: Math.random() * 1000,

    /**
     * Expected user format
     *
     * {
     *   username: string,
     *   frame: string -> imgDataURL, users video frame data | -1 means user disconnected
     * }
     *
     */
    users: [],
    wsSocket: null,
  }),

  components: {
    MeCamera,
    YouCamera,
  },

  mounted() {
    this.wsSocket = new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL);

    // Connection opened
    this.wsSocket.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      console.log('Websocket opened from conference!!!');
    });

    // Listen for messages
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
        this.users[userIndex].frame = data.frame;
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
      if (localStorage.getItem('user')) {
        return localStorage.getItem('user');
      }
      return Math.random() * 1000;
    },
  },
};
</script>

<style>
.container-fluid {
  background-color: #2c3e50;
}

</style>
