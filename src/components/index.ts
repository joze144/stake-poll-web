import { RootStore } from './rootStore';

export function createStores() {
  const rootStore = new RootStore();

  return {
    rootStore: rootStore,
    authStore: rootStore.authStore,
    eventSubscriptionStore: rootStore.eventSubscriptionStore,
    fieldListStore: rootStore.fieldListStore,
    gameStore: rootStore.gameStore,
    routerStore: rootStore.routerStore,
    websocketStore: rootStore.websocketStore,
  };
}
