<template lang="pug">
  .container
    section.section
      stamp-list
    section.section
      comment
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { stampStore } from '~/store';
import Comment from '@/components/Comment.vue';
import StampList from '@/components/StampList.vue';

@Component({
  components: {
    Comment,
    StampList,
  },
})
export default class index extends Vue {
  async fetch() {
    await stampStore.fetchStamps();
  }
}
</script>

<style lang="scss" scoped></style>
