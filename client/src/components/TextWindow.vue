<template>
  <div class="card mt-3">
    <div class="active-users">
      <div>
        <h3>Active users: </h3>
        <div ref="usersDiv" v-for="(user, indexUsers) in users" :key="indexUsers">

          <ul>
            <li><span class="font-weight-bold">{{ user }}</span></li>
          </ul>
        </div>
      </div>
    </div>
            <div class="card-body">
                <div class="card-title">
                    <h3>Chat Group</h3>
                    <hr>
                </div>
                <div class="card-body">
                    <div class="messages" v-for="(msg, index) in messages" :key="index">
                        <p><span class="font-weight-bold">{{ msg.username }}:
                            </span>{{ msg.message }}</p>
                    </div>
                </div>
            </div>
            <div class="card-footer">

                <form>
                    <div class="gorm-group">
                        <label for="user">User:</label>
                        <h2>{{ logedName }}</h2>
                    </div>
                    <div class="gorm-group pb-3">
                        <label for="message">Message:</label>
                        <input ref="newMessage" type="text" class="form-control">
                    </div>
                    <button v-on:click="send" type="submit" class="btn btn-success">Send</button>
                </form>
            </div>
    </div>

</template>

<script>

/*
<div v-for="(user, index) in users" :key="index">
          <p><span class="font-weight-bold">{{ user.username }}</span></p>
      </div>
*/

// TODO add room number with send message for server to know who to send to

export default {
  /* eslint-disable no-console */
  name: 'TextWindow',

  props: [
    'username',

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
      this.users.push(this.logedName);
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
      const data = JSON.stringify({
        username: this.logedName,
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
      const rand = 'Random cunt ' + Math.floor(Math.random() * 100);
      return rand;
    },
  },

};
</script>

<style>
  div.card-body {
    margin:5px;
    padding:5px;
    background-color: aliceblue;
    overflow: auto;
    height: 50vh;
  }

</style>
