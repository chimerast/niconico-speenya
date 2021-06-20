<template lang="pug">
  .stamp.field.is-horizontal
    .field-label.is-normal
      label.label Stamp
    .field-body
      .stamp-container
        draggable(v-model="stamps" ghost-class="ghost")
          .button.is-static(v-for="stamp in stamps" :key="stamp.id" :class="{ stamp: stamp.label === '' }")
            img.image(:src="`/storage/stamps/${stamp.path}`")
            span(v-if="stamp.label !== ''") {{ stamp.label }}
            button.delete(@click="deleteStamp(stamp.id)")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import draggable from 'vuedraggable';
import { Stamp } from '~/messages';
import { stampStore } from '~/store';

@Component({
  components: { draggable },
})
export default class DeleteStamp extends Vue {
  get stamps() {
    return stampStore.stamps;
  }

  set stamps(value: Stamp[]) {
    stampStore.updateOrder(value);
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

      &.is-static {
        pointer-events: auto;
      }

      &.stamp {
        min-width: auto;
      }

      &.ghost {
        opacity: 0.5;
      }
    }

    .image {
      max-width: 1rem;
      max-height: 1rem;
    }
  }
}
</style>
