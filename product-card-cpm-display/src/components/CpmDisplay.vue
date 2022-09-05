<template>
  <div class="cpm-container">
    <div class="cpm-container__position">{{position}}</div>
    <div class="cpm-container__cpm">{{cpm}}</div>
  </div>
</template>

<script>
export default {
  name: "CpmDisplay",
  props: {
    position: Number,
    cpm: Number
  }
}
</script>

<style lang="scss" scoped>
.cpm-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #aaa;
  border-radius: 10%;
  padding: 5px;
  min-width: 50px;
  margin: 20px;

  &__position {
    font-size: 12px;
    color: #aaa;
  }

  &__cpm {
    font-weight: bold;
  }
}
</style>