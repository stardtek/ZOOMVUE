<template>
  <div>
    <div id="nav">
      <router-link id="logo" to="/">
        <img src="@/assets/logo2_1.png" width="80"
      /></router-link>
      | <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <div v-if="logedStatus == false">
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      </div>
      <div v-if="logedStatus == true">
        <form @submit.prevent="logout">
          <button type="submit" >Logout</button>
      </form>
      </div>
    </div>

    <form @submit.prevent="login" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">
          &times;
        </button>
        <h4 class="alert-heading">Error!</h4>
        <p class="mb-0">{{ error }}</p>
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="loginData.username"
          type="text"
          class="form-control"
          id="username"
          placeholder="Enter username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">password</label>
        <input
          v-model="loginData.password"
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
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

/* const API_URL = "http://localhost:4000/messages" */
/* const API_URL_REG = "http://localhost:4000/login"; */
const API_URL_LOG = "http://localhost:4000/login";

export default {
  name: "login",
  data: () => ({
    error: "",

    loginData: {
      username: "",
      password: "",
    },
  }),
  methods: {
    login() {
      fetch(API_URL_LOG, {
        method: "POST",
        body: JSON.stringify(this.loginData),
        headers: { "content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(" this si result");
          if (result.exists) {
            localStorage.setItem("user", result.user);

            this.$router.push("/about");
          } else {
            this.error = "error";
          }
        });
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
    forceRerender() {
      this.componentKey += 1;
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
img {
  max-width: 300px;
  height: auto;
}
</style>
