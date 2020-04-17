<template lang="pug">
  .container
    section.section
      .card
        .card-header
          .card-header-title Upload stamp
        .card-content
          upload-stamp
    section.section
      .card
        .card-header
          .card-header-title Delete stamp
        .card-content
          delete-stamp
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { stampStore } from '~/store';
import UploadStamp from '@/components/UploadStamp.vue';
import DeleteStamp from '@/components/DeleteStamp.vue';

@Component({
  components: {
    UploadStamp,
    DeleteStamp,
  },
})
export default class admin extends Vue {
  async fetch() {
    await stampStore.fetchStamps();
  }
}
</script>

<style lang="scss" scoped></style>
