import { RootStore } from './rootStore';

export function createStores() {
  const rootStore = new RootStore();

  return {
    rootStore: rootStore,
    authStore: rootStore.authStore,
    websocketStore: rootStore.websocketStore,
    eventSubscriptionStore: rootStore.eventSubscriptionStore,
    routerStore: rootStore.routerStore,
    fieldListStore: rootStore.fieldListStore,
  };
}
