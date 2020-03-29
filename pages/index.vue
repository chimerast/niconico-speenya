<template lang="pug">
  .container
    section.section
      stamp
    section.section
      comment
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Comment from '@/components/Comment.vue';
import Stamp from '@/components/Stamp.vue';

@Component({
  components: {
    Comment,
    Stamp,
  },
})
export default class index extends Vue {}
</script>

<style lang="scss" scoped></style>
