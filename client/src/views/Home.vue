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
    <div class="pt-3">
      <h1 id="welcome">Welcome to Hogs saloon!</h1>
      <div>
        <hr />
        <img src="../assets/logo.png" alt="" />
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
/* eslint-env es6 */

// const API_URL = "http://localhost:4000/messages";

export default {
  name: 'home',
  data: () => ({
    welcome: 'Welcome to Hogs sallon!',
  }),

  mounted() {},
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
  computed: {
    logedStatus: () => {
      if (localStorage.getItem('user')) {
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
