import React, { Component } from 'react';
import { Container, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

class NotFound extends Component<{}, {}> {
  render() {
    return (
      <Container component="main" maxWidth="lg" className="pt-10">
        <Typography component="h1" variant="h3">
          Page not found :(
        </Typography>
        <br />
        <Typography component="h1" variant="h5">
          Maybe the page you are looking for has been removed, or you typed in the wrong URL
        </Typography>
        <Grid container justify="center" alignItems="center">
          <Link to={'/'}>Go to Home page</Link>
        </Grid>
      </Container>
    );
  }
}

export default NotFound;
