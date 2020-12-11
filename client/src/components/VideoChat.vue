<template>
  <div class="my-3">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col">
        <me-camera v-bind:username="username"></me-camera>
      </div>
      <div class="col"  v-for="user in users" :key="user.username">
        <rtc-camera v-bind:you="username"
                    v-bind:user="user.username"
                    v-bind:group="group"
                    v-bind:shouldOffer="user.shouldOffer"
        ></rtc-camera>
      </div>
    </div>
  </div>
</template>

<script>
import MeCamera from './MeCamera.vue';
import RtcCamera from './RtcCamera.vue';

export default {
  name: 'VideoChat',

  props: [
    // your username
    /** @type {string} */
    'username',

    // group ID
    /** @type {string} */
    'group',
  ],

  data: () => ({
    /**
     * Expected user format
     *
     * {
     *   username: string,
     *   shouldOffer: boolean, default false
     * }
     *
     */
    users: [],
    ws: new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL),
  }),

  components: {
    MeCamera,
    RtcCamera,
  },

  mounted() {
    // Connection opened
    this.ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('Websocket opened from conference!!!');
      // let other users know you joined
      this.ws.send(JSON.stringify({
        username: this.username,
        group: this.group,
        type: 'user-joined',
      }));
    };

    // Listen for messages
    this.ws.onmessage = (event) => {
      // Load users video frame
      // eslint-disable-next-line no-unused-vars
      const data = JSON.parse(event.data);
      if (!data.type) return;

      switch (data.type) {
        // new user joined
        case 'user-joined':
          if (data.users) {
            // you joined, get names of other users in chat
            data.users.forEach((user) => {
              // you receive peer connection offer from users already in chat
              this.users.push({
                username: user,
                shouldOffer: false,
              });
            });
          } else if (data.username) {
            // you are already in chat and new user joined
            // you offer peer connection to new user
            this.users.push({
              username: data.username,
              shouldOffer: true,
            });
          }
          break;

        case 'user-disconnected':
          if (data.username) {
            const userIndex = this.users.findIndex((user) => user.username === data.username);
            if (userIndex !== -1) {
              this.users.splice(userIndex, 1);
            }

            // eslint-disable-next-line no-console
            console.log('user disconnected', data.username);
            // eslint-disable-next-line no-console
            console.log(this.users);
          }
          break;

        default:
          break;
      }
    };
  },
};
</script>

<style scoped>

</style>
