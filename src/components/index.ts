import { RootStore } from './rootStore';

export function createStores() {
  const rootStore = new RootStore();

  return {
    rootStore: rootStore,
    authStore: rootStore.authStore,
    createPollStore: rootStore.createPollStore,
    eventSubscriptionStore: rootStore.eventSubscriptionStore,
    routerStore: rootStore.routerStore,
    websocketStore: rootStore.websocketStore,
  };
}
