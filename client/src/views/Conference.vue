<template>
  <div class="grid-container">
    <div v-for="user in users" :key="user.name">
      <camera username="{{ user.name }}" />
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
.grid-container {
  display: grid;
  grid-column-gap: 10px;
}

</style>
