<template lang="pug">
  .parameter.field.is-horizontal
    .field-label.is-normal
      label.label {{ label }}
    .field-body
      b-field
        b-radio-button(v-for="[l, v] in Object.entries(values)" v-model="nativeValue" :native-value="v" :key="l") {{ l }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'nuxt-property-decorator';

@Component
export default class CommentParameter extends Vue {
  @Model('input') value!: string | number;

  @Prop() private readonly label!: string;
  @Prop() private readonly values!: { [key: string]: string | number };

  get nativeValue(): string | number {
    return this.value;
  }

  set nativeValue(value: string | number) {
    this.$emit('input', value);
  }
}
</script>

<style lang="scss" scoped>
.parameter ::v-deep {
  .field.has-addons {
    .control {
      flex: 1;
      max-width: 8rem;

      .button {
        text-transform: capitalize;
      }
    }
  }
}
</style>
