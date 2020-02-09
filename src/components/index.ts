import { RootStore } from './rootStore';

export function createStores() {
  const rootStore = new RootStore();

  return {
    rootStore: rootStore,
    authStore: rootStore.authStore,
    createPollStore: rootStore.createPollStore,
    eventSubscriptionStore: rootStore.eventSubscriptionStore,
    historyStore: rootStore.historyStore,
    pollViewerStore: rootStore.pollViewerStore,
    routerStore: rootStore.routerStore,
    walletStore: rootStore.walletStore,
    websocketStore: rootStore.websocketStore,
  };
}
