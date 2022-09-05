<template>
  <div class="name__item common-row">
      <div class="name__text">{{name}}</div>
      <div class="name__type">{{strType()}}</div>
  </div>
</template>

<script>
export default {
  name: "AdvertName",
  props: {
    name: String,
    advType: Number,
  },
  methods: {
    strType() {
      if (this.advType === 4) {
        return '(каталог)';
      } else if (this.advType === 5) {
        return '(карточка товара)';
      } else {
        return '(поиск)';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.name__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 10px;
}

.name__text {
  text-align: start;
}

.name__type {
  text-align: start;
  font-size: 12px;
  color: #888888;
}
</style>