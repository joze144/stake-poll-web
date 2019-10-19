import Button from '@material-ui/core/Button/Button';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
  }),
);

interface LeftButtonProps {
  title: string;
  path: string;
  navigate: Function;
}

export default function LeftButton({ title, path, navigate }: LeftButtonProps) {
  const classes = useStyles();

  return (
    <Button color="inherit" className={classes.menuButton} onClick={() => navigate(path)}>
      {title}
    </Button>
  );
}
