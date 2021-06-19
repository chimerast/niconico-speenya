import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { Stamp } from '@/messages';
import { $axios } from '~/utils/api';

@Module({
  name: 'stamps',
  stateFactory: true,
  namespaced: true,
})
export default class Stamps extends VuexModule {
  stamps: Stamp[] = [];

  @Mutation
  setStamps(stamps: Stamp[]) {
    this.stamps = stamps;
  }

  @Action
  async fetchStamps() {
    const stamps: Stamp[] = await $axios.$get(`/stamps`);
    this.context.commit('setStamps', stamps);
  }

  @Action
  async addStamp(form: FormData) {
    await $axios.post('/stamps', form);
    await this.context.dispatch('fetchStamps');
  }

  @Action
  async deleteStamp(id: number) {
    await $axios.$delete(`/stamps/${id}`);
    await this.context.dispatch('fetchStamps');
  }

  @Action
  async updateOrder(stamps: Stamp[]) {
    await $axios.post(
      '/stamps/order',
      stamps.map((stamp, index) => {
        return {
          id: stamp.id,
          order: index,
        };
      })
    );

    this.context.commit('setStamps', stamps);
  }
}
