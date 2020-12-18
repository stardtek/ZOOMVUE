<template>
  <div class="row pt-5 pb-2">
    <div class="col">
      <h1>Registration</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-md-4 col-lg-4"></div>
    <div class="col col-md-4 col-lg-4">
      <form @submit.prevent="addUsser" class="mb-3">
        <div v-if="error" class="alert alert-dismissible alert-warning">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <h4 class="alert-heading">Error!</h4>
          <p class="mb-0">{{ error }}</p>
        </div>
        <div v-if="succe" class="alert alert-dismissible alert-warning">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <h4 class="alert-heading">OK!</h4>
          <p class="mb-0">{{ succe }}</p>
        </div>

        <div class="form-outline my-5">
          <input
            v-model="message.username"
            type="text"
            class="form-control"
            id="username"
            required
          />
          <label class="form-label" for="username">Username</label>
        </div>

        <div class="form-outline mb-5">
          <input
            v-model="message.email"
            type="email"
            class="form-control"
            id="email"
            required
          />
          <label class="form-label" for="email">email</label>
        </div>

        <div class="form-outline mb-5">
          <input
            v-model="message.password"
            class="form-control"
            type="password"
            id="message"
          />
          <label class="form-label" for="message">Password</label>
        </div>

        <button type="submit" class="btn btn-green btn-block">Register</button>
      </form>
    </div>
    <div class="col-md-4 col-lg-4"></div>
  </div>
</template>

<script>

/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */
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
            this.$router.push("/login");
          }
        });
    },
  },
  computed: {
    logedStatus: () => {
      if (localStorage.getItem("user")) {
        return true;
      }
      return false;
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
