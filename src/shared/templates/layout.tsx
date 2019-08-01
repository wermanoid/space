import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export interface LayoutProps {
  header?: React.ComponentType;
  footer?: React.ComponentType;
}

const useStyles = makeStyles({
  root: {
    height: '100vh',
  },
  grow: {
    flexGrow: 1,
  },
  page: {
    flexGrow: 1,
    flexWrap: 'nowrap',
    overflow: 'auto',
    border: '1px solid red',
  },
});

const Layout: React.SFC<LayoutProps> = ({ children, header, footer }) => {
  const styles = useStyles();
  return (
    <Grid
      wrap="nowrap"
      container
      direction="column"
      justify="flex-start"
      className={styles.root}
    >
      {header && React.createElement(header, null)}
      <Grid
        item
        container
        direction="column"
        justify="flex-start"
        className={styles.page}
      >
        <Grid item container alignItems="center" direction="column">
          {children}
        </Grid>
        {footer && (
          <Grid item container component="footer" justify="center">
            {React.createElement(footer, null)}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Layout;
