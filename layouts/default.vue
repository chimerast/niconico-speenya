<template lang="pug">
  .main
    .content
      nuxt
    footer.footer
      .has-text-right niconico-speenya &copy; 2015-2021 @chimerast
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator';
import { stampStore } from '~/store';

@Component
export default class index extends Vue {
  mounted() {
    const setFillHeight = () => {
      document.documentElement.style.setProperty('--innerHeight', `${window.innerHeight}px`);
    };

    // 画面のサイズ変動があった時に高さを再計算する
    window.addEventListener('resize', setFillHeight);

    // 初期化
    setFillHeight();
  }

  async fetch() {
    await stampStore.fetchStamps();
  }
}
</script>

<style lang="scss" scoped>
.main {
  min-height: var(--innerHeight, 100vh);

  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
  }
}
</style>
