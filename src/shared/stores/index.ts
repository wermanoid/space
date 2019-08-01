import { RouterStore } from 'mobx-react-router';

export const createStores = (initialState: any = {}) => {
  const routingStore = new RouterStore();

  return {
    routing: routingStore,
  };
};
