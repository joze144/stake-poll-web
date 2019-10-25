import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';
import CreatePoll from './PollBuilder/CreatePoll';
import Box from '@material-ui/core/Box/Box';

class Home extends Component<{}, {}> {
  render() {
    return (
      <Container component="main" maxWidth="md" className="pt-50">
        <Box textAlign="center">
          <Typography variant="h3" color="textPrimary">
            Create Fancy Poll
          </Typography>
          <br />
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Get instant feedback!
          </Typography>
        </Box>
        <CreatePoll />
      </Container>
    );
  }
}

export default Home;
