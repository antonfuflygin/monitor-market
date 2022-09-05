<template>
<div class="auto-control__item common-row">
  <div class="auto-control__current-cpm">
    <div v-if="switcher && currentCpm === '---'" class="auto-control__cpm-loader"></div>
    <div v-else>{{currentCpm}}</div>
  </div>
  <div class="auto-control__switcher"
       :class="{active: switcher}"
       @click="switchCpmAutoControl()"
  >{{switcher ? 'Завершить' : 'Запуск'}}</div>
</div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  name: "AdvertAutoControl",
  props: {
    id: Number,
  },
  data() {
    return {
      switcher: false,
    }
  },
  methods: {
    ...mapActions(['activateItem', 'resetCpm', 'setCpmAutoMode']),
    switchCpmAutoControl() {
      this.switcher = !this.switcher;
      this.activateItem({id: this.id, value: this.switcher});
      this.setCpmAutoMode({id: this.id});
    }
  },
  computed: {
    ...mapGetters(['getAdvert']),
    currentCpm: {
      get() {
        if (this.getAdvert(this.id).currentCpm === null) {
          return '---';
        }
        return this.getAdvert(this.id).currentCpm;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auto-control {
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  &__current-cpm {
    display: flex;
    align-items: center;
    justify-content: center;
    //min-width: 70px;
    width: 50%;
  }

  &__switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #00d200;
    //min-width: 90px;
    width: 50%;
    height: 30px;
    color: #fff;
    border-radius: 4px;
    margin: 0 10px 0 10px;
  }

  &__cpm-loader {
    border-top: 4px solid #2AA3E3;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    animation: spin 2s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.active {
  background: #e34234;
}
</style>