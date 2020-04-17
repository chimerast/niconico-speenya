<template lang="pug">
  .container
    section.section
      stamp
    section.section
      comment
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { stampStore } from '~/store';
import Comment from '@/components/Comment.vue';
import Stamp from '@/components/Stamp.vue';

@Component({
  components: {
    Comment,
    Stamp,
  },
})
export default class index extends Vue {
  async fetch() {
    await stampStore.fetchStamps();
  }
}
</script>

<style lang="scss" scoped></style>
