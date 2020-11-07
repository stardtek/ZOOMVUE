<template>
  <div>
    <form @submit.prevent="addUsser" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">
          &times;
        </button>
        <h4 class="alert-heading">Error!</h4>
        <p class="mb-0">{{ error }}</p>
      </div>
      <div v-if="succe" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">
          &times;
        </button>
        <h4 class="alert-heading">OK!</h4>
        <p class="mb-0">{{ succe }}</p>
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="message.username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Enter username"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">email</label>
        <input
          v-model="message.email"
          type="email"
          class="form-control"
          id="subject"
          placeholder="Enter email"
          required
        />
      </div>

      <div class="form-group">
        <label for="message">password</label>
        <input
          v-model="message.password"
          class="form-control"
          type="password"
          placeholder="Enter password"
          id="message"
        />
      </div>

      <button type="submit" class="btn btn-primary">Add Message</button>
    </form>
  </div>
</template>

<script>

/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

/* const API_URL = "http://localhost:4000/messages" */
const API_URL_REG = "http://localhost:4000/register";

export default {
  name: "register",
  data: () => ({
    error: "",
    succe: "",
    message: {
      username: "",
      email: "",
      password: "",
    },
  }),
  methods: {
    addUsser() {
      fetch(API_URL_REG, {
        method: "POST",
        body: JSON.stringify(this.message),
        headers: { "content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log(result.error);
          // console.log(" this si result");
          if (result.error) {
            this.error = result.error;
          } else {
            this.showMessageForm = false;
            this.error = "";
            this.succe = result.ok;
          }
          this.$router.push("/about");
        });
    },
  },
};
</script>

<style>
input{
  width: 20%;
}
img {
  max-width: 300px;
  height: auto;
}
</style>
