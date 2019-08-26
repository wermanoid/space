import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';

import Viewer from '#atom/viewer';

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
    width: '100%',
    maxWidth: '1000px',
  },
});

const Game: React.SFC<SolarSystemProps> = ({
  version = GraphicVersion.Space2D,
}) => {
  const styles = useStyles();
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        return;
      }
      init(canvas);
    },
    [version]
  );

  return <Viewer ref={canvasRef} className={styles.viewer} />;
};

export default Game;
