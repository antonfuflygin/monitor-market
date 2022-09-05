<template>
  <div class="monitor-market-app">
    <div class="monitor-market-app__header">
      <img :src="imgSrc" alt="">
      <div>Ставки в рекламном блоке:</div>
    </div>
    <div class="monitor-market-app__content">
      <cpm-display
          v-for="item in allCarouselAdverts"
          :key="item.nmId"
          :position="item.position"
          :cpm="item.cpm"></cpm-display>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import CpmDisplay from "./components/CpmDisplay";

export default {
  name: "App",
  components: {CpmDisplay},
  data() {
    return {
      imgSrc: chrome.runtime.getURL('img/logo48.png')
    }
  },
  methods: {
    ...mapActions(['getCarouselAdverts']),
  },
  computed: {
    ...mapGetters(['allCarouselAdverts']),
  },
  mounted() {
    this.getCarouselAdverts();
  }
}
</script>

<style lang="scss" scoped>
.monitor-market-app {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>