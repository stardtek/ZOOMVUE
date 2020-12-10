<template>
  <div>
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

      <button type="submit" class="btn btn-primary">Login</button>
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
    getPAram() {

    },
  },
  computed: {
    logedStatus: () => {
      if (localStorage.getItem("user")) {
        return true;
      }
      return false;
    },
    watch: {
    // when redirect to new category_name, this will be callback
      $route: "getPAram",
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
