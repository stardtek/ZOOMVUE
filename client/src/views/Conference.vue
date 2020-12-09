<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div id="nav">
          <router-link id="logo" to="/">
            <img src="@/assets/logo2_1.png" width="80" alt="LOGO"/></router-link>
          | <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> |
          <div v-if="logedStatus === false">
          <router-link to="/login">Login</router-link> |
          <router-link to="/register">Register</router-link> |
          </div>
          <div v-if="logedStatus === true">
            <form @submit.prevent="logout">
              <button type="submit" >Logout</button>
              <router-link to="/conference">Conference</router-link> |
          </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h1 style="color: red">{{ logedName }}</h1>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col">
        <me-camera></me-camera>
      </div>
      <div class="col"  v-for="user in users" :key="user.username">
        <rtc-camera v-bind:you="logedName"
                    v-bind:user="user.username"
                    v-bind:is-first="user.isFirst"
        ></rtc-camera>
      </div>
    </div>
  </div>
</template>

<script>
// adapter just makes sure that all webRTC function names are the same across all browsers
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter';
import RtcCamera from '../components/rtcCamera.vue';
import MeCamera from '../components/MeCamera.vue';

// eslint-disable-next-line no-unused-vars
const userDisconnectedStatus = -1;

export default {
  name: 'conference',

  data: () => ({
    /**
     * Expected user format
     *
     * {
     *   username: string,
     *   isFirst: boolean, default false, defines first user in chat so connection can begin
     * }
     *
     */
    users: [],
    ws: new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL),
  }),

  components: {
    RtcCamera,
    MeCamera,
  },

  mounted() {
    // Connection opened
    this.ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('Websocket opened from conference!!!');
      // request all other connected clients
      this.ws.send(JSON.stringify({
        type: 'get-all-users',
      }));
    };

    // Listen for messages
    this.ws.onmessage = (event) => {
      // Load users video frame
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(event.data);
      if (!data.type) return;

      switch (data.type) {
        case 'get-all-users-response':
          if (data.users && data.users.length === 0) {
            this.users.push({
              username: this.logedName,
              isFirst: true,
            });
          }

          data.users.forEach((user) => {
            this.users.push({
              username: user,
            });
          });
          break;

        default:
          break;
      }
    };
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

      const rand = `Random cunt ${Math.floor(Math.random() * 100)}`;
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

video {
  width: 100%;
  height: auto;
}

</style>
