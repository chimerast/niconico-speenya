<template lang="pug">
  .stamp.field.is-horizontal
    .field-label.is-normal
      label.label Stamp
    .field-body
      .stamp-container
        button.button(v-for="stamp in stamps" @click="postStamp(stamp.path)" :class="{ stamp: stamp.label === '' }")
          img.image(:src="`/storage/stamps/${stamp.path}`")
          span(v-if="stamp.label !== ''") {{ stamp.label }}
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Stamp } from '@/messages';

@Component
export default class StampList extends Vue {
  private stamps: Stamp[] = [];

  private async mounted(): Promise<void> {
    this.stamps = await this.$axios.$get(`/stamps`);
  }

  private async postStamp(path: string): Promise<void> {
    await this.$axios.$post(`/messages/stamp`, {
      path,
    });
  }
}
</script>

<style lang="scss" scoped>
.stamp {
  .stamp-container {
    flex-wrap: wrap;

    .button {
      min-width: 8rem;
      margin-right: 0.4rem;
      margin-bottom: 0.4rem;

      > *:not(:only-child):not(:last-child) {
        margin-right: 0.4rem;
      }
    }

    .button.stamp {
      min-width: auto;
    }

    .image {
      max-width: 1rem;
      max-height: 1rem;
    }
  }
}
</style>
