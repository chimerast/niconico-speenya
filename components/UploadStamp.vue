<template lang="pug">
  .upload-stamp
    form(@submit.prevent="upload")
      b-field(label="Stamp" horizontal)
        b-upload.is-clearfix(v-model="file" :disabled="uploading" drag-drop)
          section.section
            .content.has-text-centered
              template(v-if="image === undefined")
                p: b-icon(icon="upload" size="is-large")
                p Drop your files here or click to upload
              img(v-else :src="image" style="max-width: 128px; max-height: 128px;")
      b-field(label="Label" horizontal)
        b-input(v-model="label" expanded)
      b-field(horizontal)
        .control
          b-button(type="is-primary" icon-left="upload" native-type="submit" :disabled="!uploadable" :class="{ 'is-loading': uploading }") Upload
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import { stampStore } from '~/store';

@Component
export default class UploadStamp extends Vue {
  private label: string = '';
  private file: File | null = null;
  private uploading: boolean = false;

  @Watch('file')
  private onFileUpdated() {
    if (this.file === null) return;
    this.label = ''; // this.file.name;
  }

  private upload(): void {
    if (this.file === null) return;

    const form = new FormData();
    form.set('label', this.label);
    form.set('file', this.file);

    this.uploading = true;
    stampStore.addStamp(form).then(() => {
      this.label = '';
      this.file = null;
      this.uploading = false;
    });
  }

  private get image(): string | undefined {
    if (this.file) {
      return window.URL.createObjectURL(this.file);
    } else {
      return undefined;
    }
  }

  private get uploadable(): boolean {
    return this.file !== null;
  }
}
</script>
