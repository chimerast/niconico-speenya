<template lang="pug">
  .container
    section.section
      upload-stamp
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import UploadStamp from '@/components/UploadStamp.vue';

@Component({
  components: {
    UploadStamp,
  },
})
export default class index extends Vue {}
</script>

<style lang="scss" scoped></style>
