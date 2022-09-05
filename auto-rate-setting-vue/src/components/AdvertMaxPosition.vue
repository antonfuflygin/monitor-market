<template>
  <div class="max-position__item common-row">
    <img :src="srcDecr" alt=""
         @click="advertMaxPosition--">
    <input type="number"
           v-model="advertMaxPosition"
           @blur="checkInput($event)"
           @keydown.enter="checkInput($event)">
    <img :src="srcIncr" alt=""
         @click="advertMaxPosition++">
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  name: "AdvertMaxPosition",
  props: {
    id: Number
  },
  data() {
    return {
      srcDecr: chrome.runtime.getURL('auto-rate-setting-vue/src/assets/img/decr.png'),
      srcIncr: chrome.runtime.getURL('auto-rate-setting-vue/src/assets/img/incr.png'),
    }
  },
  methods: {
    ...mapActions(['editMaxPosition']),
    checkInput(event) {
      const limit = this.getAdvert(this.id).advType === 5 ? 28 : 5;

      if (limit < parseInt(event.target.value) || parseInt(event.target.value) < 0 || event.target.value === '') {
        event.target.value = this.advertMaxPosition;
      }
    }
  },
  computed: {
    ...mapGetters(['getAdvert']),

    advertMaxPosition: {
      get() {
        return this.getAdvert(this.id).maxPosition;
      },
      set(value) {
        const limit = this.getAdvert(this.id).advType === 5 ? 28 : 5;

        if (limit >= parseInt(value) && parseInt(value) > 0) {
          this.editMaxPosition({id: this.id, maxPosition: parseInt(value)});
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.max-position__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;

  & input {
    width: 40%;
    text-align: center;
    -webkit-appearance: none;
  }

  & img {
    height: 14px;
    margin: 0 10px 0 10px;
    cursor: pointer;
  }

  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  input {
    -moz-appearance: none;
  }
}
</style>