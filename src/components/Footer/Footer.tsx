import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import MediumIcon from '../Icon/MediumIcon';
import { Box, Link as MaterialLink } from '@material-ui/core';
import GithubIcon from '../Icon/GithubIcon';
import { Link } from 'react-router-dom';

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
            <Link to="/about">
              <Typography variant="subtitle1" color="textSecondary">© 2020 Stake Poll</Typography>
            </Link>
          <Typography variant="body2" color="textSecondary">Contact: me@jozhe.com</Typography>
          </Box>
          <Box className={classes.boxgrow}>
          </Box>
          <Box>
            <MaterialLink className={classes.fab} href="https://medium.com/@jozhe" target="_blank"><MediumIcon /></MaterialLink>
            <MaterialLink className={classes.fab} href="https://github.com/joze144" target="_blank"><GithubIcon /></MaterialLink>
          </Box>
        </Container>
      </footer>
    </div>
  );
}
