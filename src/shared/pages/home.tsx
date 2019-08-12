import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import Viewer from '#atom/viewer';
import { Main } from '#shared/providers';
import DataService from '#shared/services/data';

const useStyles = makeStyles({
  viewer: {
    backgroundColor: '#ccc',
    width: '100%',
    maxWidth: '1000px',
  },
});

const Home = () => {
  const styles = useStyles();
  const store = Main.userService(DataService);

  const canvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }
    const ctx: CanvasRenderingContext2D = canvas!.getContext('2d')!;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.ellipse(50, 50, 10, 10, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }, []);

  useEffect(() => {
    store.set({ id: 123 });
  }, [store.data.id]);

  return (
    <React.Fragment>
      <div> &lt; MD DropDown here</div>
      <Viewer ref={canvasRef} className={styles.viewer} />
    </React.Fragment>
  );
};

export default Home;
