<template lang="pug">
  .stamp.field.is-horizontal
    .field-label.is-normal
      label.label Stamp
    .field-body
      .stamp-container
        .button.is-static(v-for="stamp in stamps" :class="{ stamp: stamp.label === '' }")
          img.image(:src="`/storage/stamps/${stamp.path}`")
          span(v-if="stamp.label !== ''") {{ stamp.label }}
          button.delete(@click="deleteStamp(stamp.id)")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { stampStore } from '~/store';

@Component
export default class DeleteStamp extends Vue {
  get stamps() {
    return stampStore.stamps;
  }

  async deleteStamp(id: number) {
    await stampStore.deleteStamp(id);
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
