<template>
<div>
  <div>
      <nav class="navbar navbar-expand-lg navbar-expand-md navbar-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" id="logo" to="/">
        <img src="@/assets/logo3.png" class="img-fluid" width="100" alt="LOGO"/>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-mdb-toggle="collapse"
        data-mdb-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="fas fa-bars"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-item btn btn-smoke m-1" to="/">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-item btn btn-smoke m-1" to="/about">
              About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-item btn btn-smoke m-1" to="/chat">
              Chat
            </router-link>
          </li>
          <li class="nav-item" v-if="logedStatus === true">
            <router-link class="nav-item btn btn-smoke m-1" to="/private">
              Private chat
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-item btn btn-smoke m-1" to="/conference">
              Conference
            </router-link>
          </li>
        </ul>
        <div>
          <div v-if="logedStatus === false">
            <router-link class="btn btn-smoke m-1" to="/login">
              Login
            </router-link>
            <router-link class="btn btn-smoke m-1" to="/register">
              Register
            </router-link>
          </div>
          <div v-else>
            <form @submit.prevent="logout">
              <button class="btn btn-dark m-1" type="submit">Logout</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </nav>
    </div>
  <div class="container">
    <div class="row"  v-if="wsSocket !== null && query">
      <div class="col-md-2 col-lg-2"></div>
      <div class="col col-md-8 col-lg-8">
        <chatWin v-bind:username="logedName" v-bind:wsSocket="wsSocket"></chatWin>
      </div>
      <div class="col-md-2 col-lg-2"></div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col">
          <h3>Please enter Room ID to enter conference</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-lg-4"></div>
        <div class="col col-md-4 col-lg-4">
          <form @submit.prevent="roomSelect">
            <div class="form-outline my-4">
              <input
                v-model="room"
                class="form-control form-control-lg"
                type="text"
                id="roomId"
              />
              <label class="form-label" for="roomId">Room ID</label>
            </div>

            <button type="submit" class="btn btn-green btn-block">Login</button>
          </form>
        </div>
        <div class="col-md-4 col-lg-4"></div>
      </div>
    </div>
  </div>
  <div><footer class="bottom-100-CH">
    <div class="text-center p-3">
      © 2020 Copyright: HOGS Saloon
    </div>
  </footer></div>
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
    room: '',

    users: [],
    wsSocket: null,
    query: '',
  }),

  components: {
    chatWin,

  },

  mounted() {
    this.getPAram();
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

      const rand = 'Random user ' + Math.floor(Math.random() * 100);
      return rand;
    },
  },
  methods: {
    roomSelect() {
      console.log('yes');
      this.$router.push({ name: 'ChatId', params: { id: this.room } });
      this.$forceUpdate();
    },
    getPAram() {
      this.query = this.$route.params.id;
      // this.$forceUpdate();
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
  watch: {
    // when redirect to new category_name, this will be callback
    $route: 'getPAram',

  },
};
</script>

<style>

</style>
