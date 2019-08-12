import { useState } from 'react';

export default () => {
  const [data, set] = useState({ id: 0 });
  return {
    data,
    set,
  };
};
