<template>
    <div class="breadcrumbs-container r-container">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'AdminBreadcrumbs',
  props: [],
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.breadcrumbs-container {
  padding: 10px 0 20px;
  h3 {
    font-size: 20px;
    margin: 0;
  }
  a {
    color: #000;
  }
}
</style>

