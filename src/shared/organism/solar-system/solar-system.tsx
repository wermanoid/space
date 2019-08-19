import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';

import { SolarSystem as SolarModel } from '#lib/solar-system';
import { DataStore } from '#lib/data-system';
import { Render2DSystem } from '#lib/render-2d-system';
import Viewer from '#atom/viewer';

import { initialize } from './objects';

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

const SolarSystem: React.SFC<SolarSystemProps> = ({
  version = GraphicVersion.Space2D,
}) => {
  const store = new DataStore();
  const styles = useStyles();
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        return;
      }
      const system = new SolarModel(store);
      const renderer = new Render2DSystem(store);
      const { sun, earth, moon, sun2 } = initialize(store);
      const objects = [sun, earth, sun2];
      const relatives: Array<[number, number[]]> = [[earth, [moon]]];

      // objects.forEach(oId => {
      //   system.add(oId);
      //   renderer.add(oId);
      // });

      // relatives.forEach(([id, sattelites]) => {
      //   system.addRelatives(id, sattelites);
      //   renderer.add(sattelites);
      // });

      renderer.use(canvas!.getContext('2d')!);
      // system.update(0);
      renderer.update();

      // setInterval(() => {
      //   system.update(0);
      //   renderer.update();
      // }, 5000);
    },
    [version]
  );

  return <Viewer ref={canvasRef} className={styles.viewer} />;
};

export default SolarSystem;
