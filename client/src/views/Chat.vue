<template>
  <div class="container-fluid">
    <div class="row"  v-if="wsSocket !== null && query">
      <div class="col">
        <chatWin v-bind:username="logedName" v-bind:wsSocket="wsSocket"></chatWin>
      </div>
    </div>
    <div v-else>
      <div class="row">
        <div class="col">
          <h3>Please enter Room ID to enter conference</h3>
        </div>
      </div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <form @submit.prevent="roomSelect">
            <div class="form-outline my-4">
              <input
                v-model="room"
                class="form-control"
                type="text"
                id="roomId"
              />
              <label class="form-label" for="roomId">Room ID</label>
            </div>

            <button type="submit" class="btn btn-green btn-block">Login</button>
          </form>
        </div>
        <div class="col"></div>
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

      const rand = 'Random cunt ' + Math.floor(Math.random() * 100);
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
