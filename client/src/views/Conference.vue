<template>
  <div class="container-fluid">
    <div class="row" v-if="!conferenceId">
      <div class="col">
        <form @submit.prevent="selectRoom">
          <div class="form-group">
            <label for="roomId">Room</label>
            <input
              v-model="room"
              class="form-control"
              type="text"
              placeholder="Enter room Id"
              id="roomId"
            />
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
    <div v-else>
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
  </div>
</template>

<script>
// adapter just makes sure that all webRTC function names are the same across all browsers
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter';
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
    // TODO reload conference if URL is changed manually in search bar
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

      const rand = `Random cunt ${Math.floor(Math.random() * 100)}`;
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
.container-fluid {
  background-color: #2c3e50;
}

</style>
