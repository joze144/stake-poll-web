import React, { Component } from 'react';
import { Container, Typography, withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

const styles = () => ({
  rootTitle: {
    margin: 10,
  },
  title: {
    marginTop: 10,
  },
});

interface AboutPageProps {
  classes: any;
}

class AboutPage extends Component<AboutPageProps, {}> {
  constructor(props: AboutPageProps) {
    super(props);
  }

  render() {
    return (
      <Container component="main" maxWidth="md" className="pt-40">
        <Box textAlign="center">
          <Typography className={this.props.classes.rootTitle} variant="h4" color="textPrimary">
            About Stake Poll
          </Typography>
        </Box>
        <Typography variant="body1" color="textSecondary">
          Stake Poll service lets you create simple, easy to share polls and get instant feedback.
          We use the Ethereum network for fraud prevention. Each user has to authenticate with an Ethereum wallet before voting.
          Each vote is further staked with the amount of ETH users hold in the wallet. That gives poll creators an unique
          opportunity to not only get feedback, but see that feedback weighted by the amount of tokens each voter holds.
        </Typography>
        <Typography className={this.props.classes.title} variant="h5" color="textPrimary">
          How can I use the service?
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Service is free to use. You can create a poll anytime, just navigate to the home page and create a new poll.
          After a poll is created it can be shared with others using share buttons. If you want to vote on the polls
          however, you will first have to authenticate using an Ethereum wallet.
        </Typography>
        <Typography className={this.props.classes.title} variant="h5" color="textPrimary">
          How does authentication work?
        </Typography>
        <Typography variant="body1" color="textSecondary">
          We support authentication using Metamask wallet. For it to work you will have to first install Metamask plugin
          into the browser. Then you can create an Ethereum wallet or import an existing one into the plugin.
        </Typography>
        <Typography className={this.props.classes.title} variant="h5" color="textPrimary">
          I've found an issue with the service, what can I do?
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Service was created as a hobby project, and there might be some bugs which we are unaware of.
          Please, if you find any issue, write us to the email: me@jozhe.com
        </Typography>
      </Container>
    );
  }
}

export default withStyles(styles)(AboutPage);
