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
  <div class="container-fluid">
    <div class="row pt-5">
      <div class="col">
        <h1>Login</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-lg-4"></div>
      <div class="col col-md-4 col-lg-4">
        <form @submit.prevent="login" class="mb-3">
          <div v-if="error" class="alert alert-dismissible alert-warning">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <h4 class="alert-heading">Error!</h4>
            <p class="mb-0">{{ error }}</p>
          </div>

          <div class="form-outline my-5">
            <input
              v-model="loginData.username"
              type="text"
              class="form-control border-start border-bottom border-end"
              @focusin="(e) => {e.target.closest('input').classList.add('border-primary');}"
              @focusout="(e) => {e.target.closest('input').classList.remove('border-primary');}"
              id="username"
              required
            />
            <label class="form-label" for="username">Username</label>
          </div>

          <div class="form-outline mb-5">
            <input
              v-model="loginData.password"
              class="form-control border-start border-bottom border-end"
              @focusin="(e) => {e.target.closest('input').classList.add('border-primary');}"
              @focusout="(e) => {e.target.closest('input').classList.remove('border-primary');}"
              type="password"
              id="password"
            />
            <label class="form-label" for="password">Password</label>
          </div>

          <button type="submit" class="btn btn-green btn-block">Login</button>
        </form>
      </div>
      <div class="col-md-4 col-lg-4"></div>
    </div>
    <div>
      <footer class="align-items-center">
        <div class="text-center">
          © 2020 Copyright: HOGS Saloon
        </div>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */
/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */

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
      fetch(process.env.VUE_APP_API_URL_LOG, {
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
