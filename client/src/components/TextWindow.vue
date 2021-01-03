<template>
  <div class="card">
    <div class="active-users" v-if="!inConference">
      <div class="card-body">
        <div class="card-title">
          <h3>Active users:</h3>
        </div>
        <ul ref="usersDiv" v-for="(user, indexUsers) in users" :key="indexUsers"
            class="list-group list-group-flush"
        >
          <li class="list-group-item">
            <span class="font-weight-bold">{{ user === username ? user + ' (You)' : user }}</span>
          </li>
        </ul>
      </div>
    </div>
      <div class="card-body p-0">
          <div class="card-title">
              <h3>Chat Group</h3>
              <hr>
          </div>
          <div class="card-body overflow-auto" id="message-list">
            <ul class="list-group list-group-flush">
              <li class="list-group-item" v-for="(msg, index) in messages" :key="index">
                <div v-if="username === msg.username"
                     class="float-end font-weight-bold text-break text-right text-end"
                >
                  {{ msg.message }}
                </div>
                <div v-else class="float-start text-justify text-break text-left text-start">
                    <span class="font-weight-bold">
                      {{ msg.username }}:
                    </span>
                    {{ msg.message }}
                </div>
              </li>
            </ul>
          </div>
      </div>
      <div class="card-footer">
          <form @submit.prevent class="pb-3">
              <div class="form-outline pb-3">
                  <input
                    ref="newMessage"
                    type="text"
                    class="form-control border-start border-bottom border-end"
                    @focusin="(e) => {e.target.closest('input').classList.add('border-primary');}"
                    @focusout="(e) => {
                      e.target.closest('input').classList.remove('border-primary');
                    }"
                    id="message">
                  <label class="form-label" for="message">Message</label>
              </div>
              <button v-on:click="send"
                      type="submit"
                      class="btn btn-green btn-block"
              >Send</button>
          </form>
      </div>
    </div>
</template>

<script>
export default {
  /* eslint-disable no-console */
  name: 'TextWindow',

  props: [
    'username',
    'inConference',
  ],

  data: () => ({
    WebSocket: new WebSocket(process.env.VUE_APP_CHAT_WS_URL),
    messages: [],
    users: [],
  }),

  mounted() {
    // eslint-disable-next-line no-unused-vars
    this.WebSocket.onopen = (event) => {
      // eslint-disable-next-line no-console
      console.log('Open ');

      // const data = JSON.parse(event.data);
      this.users.push(this.username);
      // console.log(event);
    };

    this.WebSocket.onmessage = (event) => {
      // eslint-disable-next-line no-console
      // console.log('message get ', event);
      const data = JSON.parse(event.data);
      console.log(data, 'data');
      if (data.disconected) {
        console.log('Izbriše');
        for (let i = 0; i < this.users.length; i += 1) {
          if (this.users[i] === data.username) {
            this.users.splice(i, 1);
          }
        }
      } else {
        // try to update on new user
        if (!this.users.includes(data.username)) {
          this.users.push(data.username);
          // this.forceRerender();
        }
        this.messages.push(data);
      }
      console.log(this.users);
    };
    this.WebSocket.addEventListener('close', () => {
      // eslint-disable-next-line no-console
      console.log('WebSocket is closed!!!');
    });
  },

  methods: {
    // eslint-disable-next-line no-unused-vars
    send(event) {
      if (this.$refs.newMessage.value === '') return;
      const data = JSON.stringify({
        username: this.username,
        message: this.$refs.newMessage.value,
        group: this.$route.params.id,
      });
      this.$refs.newMessage.value = '';
      this.WebSocket.send(data);
    },

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
      const rand = 'Random user' + Math.floor(Math.random() * 100);
      return rand;
    },
  },

};
</script>

<style>
#message-list {
  height: 50vh;
}

</style>
