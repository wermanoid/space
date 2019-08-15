import React, { useEffect } from 'react';

import SolarSystemRenderer from '#organism/solar-system';
import { Main } from '#shared/providers';
import DataService from '#shared/services/data';

const Home = () => {
  const store = Main.userService(DataService);

  useEffect(() => {
    store.set({ id: 123 });
  }, [store.data.id]);

  return (
    <React.Fragment>
      <div> &lt; MD DropDown here</div>
      <SolarSystemRenderer />
    </React.Fragment>
  );
};

export default Home;
