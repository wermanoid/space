import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';

import { init } from './init';

export enum GraphicVersion {
  Space2D,
  Space3D,
}

export interface SolarSystemProps {
  version?: GraphicVersion;
}

const useStyles = makeStyles({
  viewer: {
    backgroundColor: '#ccc',
    flexGrow: 1,
    width: '100%',
    maxWidth: '1400px',
  },
});

const Game: React.SFC<SolarSystemProps> = ({
  version = GraphicVersion.Space2D,
}) => {
  const styles = useStyles();
  const canvasRef = useCallback((canvas: HTMLDivElement | null) => {
    if (!canvas) {
      return;
    }
    init(canvas);
  }, []);

  return <div ref={canvasRef} className={styles.viewer} />;
};

export default Game;
