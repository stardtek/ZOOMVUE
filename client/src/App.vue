<template>
  <nav class="navbar navbar-expand-lg navbar-expand-md navbar-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" id="logo" to="/">
        <img src="@/assets/logo3.png" class="img-fluid" width="100" alt="LOGO"/>
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
        <div>
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
  <router-view class="py-4">
  </router-view>
  <footer class="bottom-100">
    <div class="text-center p-3">
      © 2020 Copyright: HOGS Saloon
    </div>
  </footer>
</template>
<script>
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */

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
    logout() {
      localStorage.removeItem("user");
      this.$forceUpdate();
      this.$root.$forceUpdate();
      // this.$router.push("/login");
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
<style lang="scss">
$orange: #FF7F50;
$gray: #2C3E50;
$green: #556B2F;
$white: #FFFAFA;
$smoke-white: #F5F5F5;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $gray;
}

.navbar {
  background-color: $orange;
}

.navbar-toggler {
  color: $gray;
}

footer {
  width: 100%;
  background-color: $orange;
}

.btn-green {
  background-color: $green;
  color: $white;
  font-weight: bold;
  font-size: medium;
}

.btn-smoke {
  background-color: $smoke-white;
  font-weight: bold;
}

.card {
  background-color: $smoke-white;
}

.link-gray {
  color: $gray;
  font-size: larger;
}

.link-smoke {
  color: $smoke-white;
  font-size: larger;
}

</style>
