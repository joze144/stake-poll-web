import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import MediumIcon from '../Icon/MediumIcon';
import { Box, Link as MaterialLink } from '@material-ui/core';
import GithubIcon from '../Icon/GithubIcon';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 30,
    bottom: 0,
  },
  rootrow: {
    display: 'flex',
  },
  box1: {
    flex: 4,
  },
  box2: {
    flex: 1
  },
  boxgrow: {
    flexGrow: 1,
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.primary.main,
  },
  fab: {
    margin: 10,
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container className={classes.rootrow} maxWidth="xl">
          <Box>
          <Typography variant="subtitle1" color="textSecondary">Stake Poll</Typography>
          <Typography variant="body2" color="textSecondary">me@jozhe.com</Typography>
          </Box>
          <Box className={classes.boxgrow}>
          </Box>
          <Box>
            <MaterialLink className={classes.fab} href="https://medium.com/@jozhe"><MediumIcon /></MaterialLink>
            <MaterialLink className={classes.fab} href="https://github.com/joze144"><GithubIcon /></MaterialLink>
          </Box>
        </Container>
      </footer>
    </div>
  );
}
