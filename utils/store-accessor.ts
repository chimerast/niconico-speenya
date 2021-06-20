import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import Stamps from '~/store/stamps';

// eslint-disable-next-line import/no-mutable-exports
let stampStore: Stamps;

function initialiseStores(store: Store<any>): void {
  stampStore = getModule(Stamps, store);
}

export { initialiseStores, stampStore };
