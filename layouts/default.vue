<template lang="pug">
  .main
    .content
      nuxt
    footer.footer
      .has-text-right niconico-speenya &copy; 2015-2020 @chimerast
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator';
import { stampStore } from '~/store';

@Component
export default class index extends Vue {
  async fetch() {
    await stampStore.fetchStamps();
  }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
  }
}
</style>
