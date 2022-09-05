<template>
  <div class="cpm-limit__item common-row">
    <input type="number" v-model="cpmLimit" ref="input" @blur="checkInput($event)" @keydown.enter="checkInput($event)">
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";

export default {
  name: "AdvertCpmLimit",
  props: {
    id: Number,
  },
  methods: {
    ...mapActions(['editCpmLimit']),
    checkInput(event) {
      if (parseInt(event.target.value) < 50 || event.target.value === '') {
        event.target.value = this.cpmLimit;
      }
    }
  },
  computed: {
    ...mapGetters(['getAdvert']),

    cpmLimit: {
      get() {
        return this.getAdvert(this.id).cpmLimit;
      },
      set(value) {
        if (parseInt(value) >= 50) {
          this.editCpmLimit({id: this.id, cpmLimit: parseInt(value)});
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cpm-limit__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;

  & input {
    width: 100%;
    text-align: center;
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