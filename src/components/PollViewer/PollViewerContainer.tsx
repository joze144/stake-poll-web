import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { IPollViewerStore } from './pollViewerStore';
import Container from '@material-ui/core/Container/Container';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box/Box';
import PollResults from './PollResults';
import PollVote from './PollVote';
import PollNotFound from './PollNotFound';
import { IAuthStore } from '../SignUp/authStore';
import { IWebsocketStore } from '../Websocket/websocketStore';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
// @ts-ignore
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import CopyUrl from './CopyUrl';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

interface MatchParams {
  id: string;
}

const styles = () => ({
  fab: {
    margin: 5,
  },
  shareButton: {
    margin: 5,
    cursor: 'pointer',
    "&:hover": {
      opacity: 0.75,
    },
  },
  flexContainer: {
    display: 'flex',
  },
  firstbox: {
    flex: '4',
  },
  noResults: {
    margin: 100
  }
});

interface PollViewerContainerProps extends RouteComponentProps<MatchParams> {
  authStore?: IAuthStore;
  pollViewerStore?: IPollViewerStore;
  websocketStore?: IWebsocketStore;
  classes: any;
}

interface PollViewerContainerState {
  id: string;
  showResults: boolean;
}

@inject('authStore', 'pollViewerStore', 'websocketStore')
@observer
class PollViewerContainer extends Component<PollViewerContainerProps, PollViewerContainerState> {
  constructor(props: PollViewerContainerProps) {
    super(props);
    const id = this.props.match.params.id;
    this.state = {
      id: id,
      showResults: false,
    };
  }

  componentDidMount(): void {
    if (this.props.authStore!.hydrated) {
      this.props.pollViewerStore!.loadNewPoll(this.state.id);
    } else {
      this.props.pollViewerStore!.setPollId(this.state.id);
    }
    this.props.websocketStore!.joinPollChannel();
  }

  componentWillUnmount(): void {
    this.props.websocketStore!.leavePollChannel();
  }

  _voteOnPoll = (pollOptionId: string) => {
    this.props.pollViewerStore!.voteOnPoll(pollOptionId);
  };

  _showResults = () => {
    this.setState({showResults: true});
  };

  _changeStakedMode = () => {
    this.props.pollViewerStore!.setStakedMode(!this.props.pollViewerStore!.stakedMode);
  };

  handleFocus = (event: any) => {
    event.preventDefault();
    const { target } = event;
    const extensionStarts = target.value.length;
    target.focus();
    target.setSelectionRange(0, extensionStarts);
  };

  render() {
    const loading = this.props.pollViewerStore!.loading;
    const noPoll = this.props.pollViewerStore!.noPoll;
    const loggedIn = this.props.authStore!.loggedId;
    const voted = !!this.props.pollViewerStore!.chosenOption;
    const title = this.props.pollViewerStore!.title;
    const options = this.props.pollViewerStore!.options;
    const haveResults = options && options.findIndex(({weight}) => weight > 0) > -1;
    const chosenOption = this.props.pollViewerStore!.chosenOption;
    const chosenOptionId = chosenOption ? chosenOption.id : null;
    const url = this.props.pollViewerStore!.url;
    const stakedResults = this.props.pollViewerStore!.stakedMode;
    const stakedSwitch = (
      <Typography className={this.props.classes.fab} component="div" color="textSecondary">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>Normal Results</Grid>
          <Grid item>
            <Switch checked={this.props.pollViewerStore!.stakedMode} onChange={this._changeStakedMode} value={stakedResults} />
          </Grid>
          <Grid item>Staked Results</Grid>
        </Grid>
      </Typography>
    );

    const pollResultsGraph = haveResults ? (<PollResults stakedResults={stakedResults} options={options} />) :
      (<Box textAlign="center">
        <Typography className={this.props.classes.noResults} variant="h4" color="textSecondary">No results to show</Typography>
      </Box>);

    const hideResults = !voted && !this.state.showResults;
    const canVote = loggedIn && !voted;

    let top;
    let content;
    let share = (
      <Box className={this.props.classes.flexContainer}>
        <Box className={this.props.classes.firstbox}>
          <Typography variant="body1" color="textSecondary">
            Number of Voters: {this.props.pollViewerStore!.votersNumber}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Total Token Amount: {this.props.pollViewerStore!.totalTokenAmount} ETH
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Poll Views: {this.props.pollViewerStore!.viewsNumber}
          </Typography>
        </Box>
        <Box>
        <Typography variant="body1" color="textSecondary">
          Share it with others:
        </Typography>
        <Box className={this.props.classes.flexContainer} textAlign="center" alignItems="center" alignContent="center">
          <FacebookShareButton className={this.props.classes.shareButton} url={url}>
            <FacebookIcon
              size={35}
              round />
          </FacebookShareButton>
          <TwitterShareButton
            className={this.props.classes.shareButton}
            url={url}
            title={title} hashtags={["stakepoll"]} via="stakepoll">
            <TwitterIcon
              size={35}
              round />
          </TwitterShareButton>
          <CopyUrl url={url}/>
        </Box>
        </Box>
      </Box>);

    if (loading) {
      top = (<Box textAlign="center">
        <Typography variant="h4" color="textPrimary">
          Loading...
        </Typography>
      </Box>);
      content = (<span />);
      share = (<span />);
    } else if (noPoll) {
      top = (<PollNotFound />);
      content = (<span />);
      share = (<span />);
    } else if (hideResults) {
      const bottomText = loggedIn ? "Vote on the question!" : "Log in to vote!";
      top = (<Box textAlign="center">
        <Typography variant="h4" color="textPrimary">
          Question: {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {bottomText}
        </Typography>
      </Box>);
      content = (
        <Box alignItems="center" p={2}>
          <PollVote hideResults={hideResults} canVote={canVote} chosenOptionId={chosenOptionId} options={options} stakedResults={stakedResults} voteOnPoll={this._voteOnPoll} />
          <Box textAlign="center">
            <Tooltip title="Show results">
              <Fab color="secondary" aria-label="show more" className={this.props.classes.fab} onClick={this._showResults}>
                <ExpandMoreIcon />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
      );
      share = (<span />);
    } else {
      const bottomText = loggedIn ? "" : "Log in to vote!";
      top = (<Box textAlign="center">
        <Typography variant="h4" color="textPrimary">
          Question: {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {bottomText}
        </Typography>
      </Box>);
      content = (
        <Box alignItems="center" p={2}>
          <PollVote hideResults={hideResults} canVote={canVote} chosenOptionId={chosenOptionId} options={options} stakedResults={stakedResults} voteOnPoll={this._voteOnPoll} />
          {stakedSwitch}
          {pollResultsGraph}
        </Box>
      );
    }

    return (
      <Container component="main" maxWidth="md" className="pt-40 just-center">
        {top}
        {content}
        {share}
      </Container>
    )
  }
}

export default withStyles(styles)(PollViewerContainer);
