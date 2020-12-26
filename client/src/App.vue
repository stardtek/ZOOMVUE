<template>
<div>
  <router-view class="">
  </router-view>

</div>
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
  min-height: 100vh;
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
.bottom-100-HO{
  margin-top: 55vh;

}
.bottom-100-LO{
  margin-top: 43vh;

}
.bottom-100-AB{
  margin-top: 75vh;

}
.bottom-100-CH{
  margin-top: 65vh;

}
.bottom-100-CO{
  margin-top: 65vh;

}
.bottom-100-PC{
  margin-top: 10vh;

}
.bottom-100-RE{
  margin-top: 35vh;

}

</style>
