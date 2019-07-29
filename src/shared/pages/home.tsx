import React, { createRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import Viewer from '#atom/viewer';

const useStyles = makeStyles({
  viewer: {
    backgroundColor: '#ccc',
  },
});

const Home = () => {
  const styles = useStyles();
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => console.log(canvasRef.current));

  return (
    <React.Fragment>
      Home
      <Viewer ref={canvasRef} className={styles.viewer} />
    </React.Fragment>
  );
};

export default Home;
