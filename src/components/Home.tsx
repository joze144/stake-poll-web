import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';

class Home extends Component<{}, {}> {
  render() {
    return (
      <Container component="main" maxWidth="lg" className="pt-10">
        <Typography component="h1" variant="h3">
          This is HOME!
        </Typography>
      </Container>
    );
  }
}

export default Home;
