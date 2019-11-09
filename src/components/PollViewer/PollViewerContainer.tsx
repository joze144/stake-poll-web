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

interface MatchParams {
  id: string;
}

const styles = () => ({
  fab: {
    margin: 5,
  },
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

  render() {
    const loading = this.props.pollViewerStore!.loading;
    const noPoll = this.props.pollViewerStore!.noPoll;
    const loggedIn = this.props.authStore!.loggedId;
    const voted = !!this.props.pollViewerStore!.chosenOption;
    const title = this.props.pollViewerStore!.title;
    const options = this.props.pollViewerStore!.options;
    const chosenOption = this.props.pollViewerStore!.chosenOption;
    const chosenOptionId = chosenOption ? chosenOption.id : null;

    const hideResults = !voted && loggedIn && !this.state.showResults;
    const canVote = loggedIn && !voted;

    let top;
    let content;
    if (loading) {
      top = (<Box textAlign="center">
        <Typography variant="h3" color="textPrimary">
          Loading...
        </Typography>
      </Box>);
      content = (<span />)
    } else if (noPoll) {
      top = (<PollNotFound />);
      content = (<span />);
    } else if (hideResults) {
      top = (<Box textAlign="center">
        <Typography variant="h3" color="textPrimary">
          Question: {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Vote on the question!
        </Typography>
      </Box>);
      content = (
        <Box alignItems="center" p={2}>
          <PollVote hideResults={hideResults} canVote={canVote} chosenOptionId={chosenOptionId} options={options} voteOnPoll={this._voteOnPoll} />
          <Box textAlign="center">
            <Fab color="secondary" aria-label="show more" className={this.props.classes.fab} onClick={this._showResults}>
              <ExpandMoreIcon />
            </Fab>
          </Box>
        </Box>
      )
    } else {
      top = (<Box textAlign="center">
        <Typography variant="h3" color="textPrimary">
          Question: {title}
        </Typography>
      </Box>);
      content = (
        <Box alignItems="center" p={2}>
          <PollVote hideResults={hideResults} canVote={canVote} chosenOptionId={chosenOptionId} options={options} voteOnPoll={this._voteOnPoll} />
          <PollResults title={title} options={options} chosenOption={chosenOption} />
        </Box>
      )
    }

    return (
      <Container component="main" maxWidth="md" className="pt-50 just-center">
        {top}
        {content}
      </Container>
    )
  }
}

export default withStyles(styles)(PollViewerContainer);
