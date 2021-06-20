<template lang="pug">
  .comment
    form(@submit.prevent="postComment")
      b-field(label="Comment" horizontal)
        b-field
          b-input(v-model="comment" placeholder="Please input your comment" expanded)
          .control
            b-button(type="is-primary" icon-left="comment" native-type="submit")
      comment-parameter(v-model="size" label="Size" :values="{ big: 15, medium: 10, small: 8 }")
      comment-parameter(v-model="speed" label="Speed" :values="{ fast: 1500, medium: 2000, slow: 3000 }")
      comment-parameter(v-model="color" label="Color" :values="{ black: 'black', red: 'red', blue: 'blue', green: 'green' }")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import CommentParameter from './CommentParameter.vue';

@Component({
  components: {
    CommentParameter,
  },
})
export default class Comment extends Vue {
  private comment: string = '';
  private size: number = 10;
  private speed: number = 2000;
  private color: string = 'black';

  private async postComment(): Promise<void> {
    if (this.comment !== '') {
      const body = this.comment;
      this.comment = '';
      await this.$axios.$post('/messages/comment', {
        body,
        size: this.size,
        duration: this.speed,
        color: this.color,
      });
    }
  }
}
</script>
