<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Chat</h3>
              <hr>
          </div>
        <div class="card-body overflow-auto" id="message-list">
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(msg, index) in messages" :key="index">
              <div v-if="username === msg.from"
                   class="float-end font-weight-bold text-break text-right text-end"
              >
                {{ msg.message }}
              </div>
              <div v-else class="float-start text-justify text-break text-left text-start">
                    <span class="font-weight-bold">
                      {{ msg.from }}:
                    </span>
                {{ msg.message }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent>
          <div class="form-outline pb-3">
            <input
              ref="newMessage"
              type="text"
              class="form-control border-start border-bottom border-end"
              @focusin="(e) => {e.target.closest('input').classList.add('border-primary');}"
              @focusout="(e) => {e.target.closest('input').classList.remove('border-primary');}"
              id="message">
            <label class="form-label" for="message">Message</label>
          </div>
          <button v-on:click="send" type="submit" class="btn btn-green btn-block">Send</button>
        </form>
      </div>
  </div>

</template>

<script>
// import { query } from 'express';

/*
<div v-for="(user, index) in users" :key="index">
          <p><span class="font-weight-bold">{{ user.username }}</span></p>
      </div>
*/
const API_URL_GETMSGS = 'http://localhost:4000/getUsermessages';

export default {
  /* eslint-disable no-console */
  name: 'TextWindow',

  props: [
    'username',

  ],

  data: () => ({
    WebSocket: new WebSocket(process.env.VUE_APP_PRIVATE_CHAT_WS_URL),
    messages: [],
    users: [],
    names: {
      too: '',
      from: '',
    },
  }),

  mounted() {
    this.names.from = this.logedName;
    this.names.too = this.$route.params.id;
    fetch(API_URL_GETMSGS, {
      method: 'POST',
      body: JSON.stringify(this.names),
      headers: { 'content-type': 'application/json' },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(' this si result');
        this.messages = result;
      });
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
      console.log(data);
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
        from: this.logedName,
        message: this.$refs.newMessage.value,
        to: this.names.too,
      });
      this.$refs.newMessage.value = '';
      this.WebSocket.send(data);
    },

    getPAram() {
      this.names.from = this.logedName;
      this.names.too = this.$route.params.id;
      fetch(API_URL_GETMSGS, {
        method: 'POST',
        body: JSON.stringify(this.names),
        headers: { 'content-type': 'application/json' },
      })
        .then((response) => response.json())
        .then((result) => {
          this.messages = result;
          console.log(this.messages);
          console.log(' this si messages');
        });
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
      const rand = 'Random user ' + Math.floor(Math.random() * 100);
      return rand;
    },
    update: () => {
      fetch(API_URL_GETMSGS, {
        method: 'POST',
        body: JSON.stringify(this.names),
        headers: { 'content-type': 'application/json' },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(' this si result');
          this.messages = result;
        });
    },
  },
  watch: {
    // when redirect to new category_name, this will be callback
    $route: 'getPAram',

  },

};
</script>

<style>
  #message-list {
    height: 50vh;
  }
</style>
