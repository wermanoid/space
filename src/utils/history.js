import { map, flattenDeep, memoize } from "lodash";

export const createHistory = (maxLength, sampling) => {
  function push(item) {
    this.target.push(item);
  }

  const reader = memoize(
    (at, items) => {
      return flattenDeep(
        map(items, (item, index) => map(item, i => ({ item: i, index })))
      );
    },
    at => at
  );

  return {
    sample: 0,
    length: 0,
    items: [],
    target: null,
    lock() {
      this.sample += 1;
      if (this.sample === sampling) {
        this.target = [];
        this.at = Date.now();
        this.sample = 0;
        this.push = push.bind(this);
      }
    },
    unlock() {
      if (this.items.length > maxLength) this.items.shift();
      if (this.target) {
        this.items.push(this.target);
        this.target = null;
        this.push = () => {};
      }
    },
    push(item) {},
    read() {
      return reader(this.at, this.items);
    }
  };
};
