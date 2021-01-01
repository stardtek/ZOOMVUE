<template>
<div>
  <div>
      <nav class="navbar navbar-expand-lg navbar-expand-md navbar-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" id="logo" to="/">
        <img src="@/assets/logo.png" class="img-fluid" width="100" alt="LOGO"/>
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
        <div class="mb-2 mb-lg-0">
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
  <div class="container pt-5" v-if="!conferenceId">
    <div class="row">
      <div class="col">
        <h3>Please enter Room ID to enter conference</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-lg-4"></div>
      <div class="col col-md-4 col-lg-4">
        <form @submit.prevent="selectRoom" class="form-group">
          <div class="form-outline my-4">
            <input
              v-model="room"
              type="text"
              id="roomId"
              class="form-control form-control-lg border-start border-bottom border-end"
              @focusin="(e) => {e.target.closest('input').classList.add('border-primary');}"
              @focusout="(e) => {e.target.closest('input').classList.remove('border-primary');}"
            />
            <label class="form-label" for="roomId">Room ID</label>
          </div>
          <button type="submit" class="btn btn-green btn-block">Login</button>
        </form>
      </div>
      <div class="col-md-4 col-lg-4"></div>
    </div>
  </div>
  <div class="container-fluid py-5" v-else>
    <div class="row">
      <div class="col-sm-6 col-md-9 col-lg-9">
        <video-chat v-bind:username="logedName"
                    v-bind:group="conferenceId"
        ></video-chat>
      </div>
      <div class="col-sm-6 col-md-3 col-lg-3">
        <text-window v-bind:username="logedName"></text-window>
      </div>
    </div>
  </div>
  <div>
    <footer class="align-items-center">
      <div class="text-center">
        © 2020 Copyright: HOGS Saloon
      </div>
    </footer>
  </div>
</div>
</template>

<script>
import VideoChat from '@/components/VideoChat.vue';
import TextWindow from '@/components/TextWindow.vue';

export default {
  name: 'conference',

  data: () => ({
    conferenceId: '',
    room: '',
  }),

  components: {
    TextWindow,
    VideoChat,
  },

  mounted() {
    this.getParam();
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

      const rand = `Random user ${Math.floor(Math.random() * 100)}`;
      return rand;
    },
  },
  methods: {
    selectRoom() {
      this.$router.push({ name: 'ConferenceId', params: { id: this.room } });
    },
    getParam() {
      if (this.conferenceId) {
        // make sure page reloads when you exit or change conference room
        // otherwise your camera stays connected to the chat instead of disconnecting
        window.location.reload();
      }

      this.conferenceId = this.$route.params.id;
      // eslint-disable-next-line no-console
      console.log('route changed');
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
  watch: {
    // when redirect to new category_name, this will be callback
    $route: 'getParam',
  },
};
</script>

<style>

</style>
