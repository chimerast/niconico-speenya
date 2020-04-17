<template lang="pug">
  .container
    section.section
      stamp-list
    section.section
      comment
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Comment from '@/components/Comment.vue';
import StampList from '@/components/StampList.vue';

@Component({
  components: {
    Comment,
    StampList,
  },
})
export default class index extends Vue {}
</script>

<style lang="scss" scoped></style>
