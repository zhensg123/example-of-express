<template>
  <div id="app">
    <!-- <router-view v-if="$route.path.indexOf('/login') < 0" /> -->
    <router-view name="login"></router-view>
    <router-view></router-view>
  </div>
</template>



<script>
export default {
  data() {
    return {
    };
  }
};
</script>
  

  
