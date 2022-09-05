<template>
  <div class="id__item common-row">{{id}}</div>
</template>

<script>
export default {
  name: "AdvertId",
  props: {
    id: Number,
  }
}
</script>

<style lang="scss" scoped>
.id__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
  min-width: 100px;
}
</style>