import React, { createRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import Viewer from '#atom/viewer';

const useStyles = makeStyles({
  viewer: {
    backgroundColor: '#ccc',
    width: '100%',
    maxWidth: '1000px',
  },
});

const Home = () => {
  const styles = useStyles();
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    console.log('called', canvasRef.current);
    const ctx: CanvasRenderingContext2D = canvasRef.current!.getContext('2d')!;
    ctx.ellipse(50, 50, 10, 10, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'dashed black';
    ctx.stroke();
  });

  return (
    <React.Fragment>
      Home
      <Viewer ref={canvasRef} className={styles.viewer} />
    </React.Fragment>
  );
};

export default Home;
