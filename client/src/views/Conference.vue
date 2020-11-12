<template>
  <div class="container-fluid">
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
      <div class="col" v-for="user in users" :key="user.name">
        <camera v-bind:username="user.name" />
      </div>
    </div>
  </div>
</template>

<script>
import Camera from '../components/Camera.vue';

export default {
  name: 'conference',

  data: () => ({
    users: [
      { name: 'Rok Šerak' },
      { name: 'Žan Ostrožnik' },
      { name: 'Miha Gošte' },
      { name: 'Gašper Habjan' },
    ],
  }),

  components: {
    Camera,
  },
};
</script>

<style>
.container-fluid {
  background-color: #2c3e50;
}

</style>
