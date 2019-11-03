import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  }),
);

export default function Title() {
  const classes = useStyles();

  return <Typography variant="h6" className={classes.title} />;
}
