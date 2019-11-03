import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { v4 } from 'uuid';
import { IPollViewerStore } from './pollViewerStore';
import { IEventSubscriptionState } from '../EventSubscription/IEventSubscriptionComponent';
import Container from '@material-ui/core/Container/Container';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box/Box';
import PollResults from './PollResults';
import PollVote from './PollVote';
import PollNotFound from './PollNotFound';
import { IAuthStore } from '../SignUp/authStore';
import { IWebsocketStore } from '../Websocket/websocketStore';

interface MatchParams {
  id: string;
}

interface PollViewerContainerProps extends RouteComponentProps<MatchParams> {
  authStore?: IAuthStore;
  pollViewerStore?: IPollViewerStore;
  websocketStore?: IWebsocketStore;
}

interface PollViewerContainerState extends IEventSubscriptionState {
  id: string;
}

@inject('authStore', 'pollViewerStore', 'websocketStore')
@observer
class PollViewerContainer extends Component<PollViewerContainerProps, PollViewerContainerState> {
  constructor(props: PollViewerContainerProps) {
    super(props);
    const id = this.props.match.params.id;
    this.state = {
      id: id,
      componentId: v4(),
    }
  }

  componentDidMount(): void {
    if (this.props.authStore!.hydrated) {
      this.props.pollViewerStore!.loadNewPoll(this.state.id);
    } else {
      this.props.pollViewerStore!.setPollId(this.state.id);
    }
  }

  componentWillUnmount(): void {
  }

  _voteOnPoll = (pollOptionId: string) => {
    this.props.pollViewerStore!.voteOnPoll(pollOptionId);
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

    let content;
    if (loading) {
      content = (<Box textAlign="center">
        <Typography variant="h3" color="textPrimary">Loading...</Typography>
      </Box>)
    } else if (noPoll) {
      content = (<PollNotFound />);
    } else if (!voted) {
      content = (
        <Box>
          <PollVote canVote={true} chosenOptionId={chosenOptionId} title={title} options={options} voteOnPoll={this._voteOnPoll} />
        </Box>
      )
    } else {
      content = (
        <Box>
          <PollVote canVote={false} chosenOptionId={chosenOptionId} title={title} options={options} voteOnPoll={this._voteOnPoll} />
          <PollResults title={title} options={options} chosenOption={chosenOption} />
        </Box>
      )
    }

    return (
      <Container component="main" maxWidth="md" className="pt-50">
        {content}
      </Container>
    )
  }
}

export default PollViewerContainer;
