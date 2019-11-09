import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '@material-ui/core';
import { IHistoryStore } from './historyStore';
import { IAuthStore } from '../SignUp/authStore';

interface HistoryProps {
  authStore?: IAuthStore;
  historyStore?: IHistoryStore;
}

@inject('historyStore')
@observer
class History extends Component<HistoryProps> {
  constructor(props: HistoryProps) {
    super(props);
  }

  componentDidMount(): void {
    this.props.historyStore!.loadUserHistory(0);
  }

  render() {
    return (
      <Container component="main" maxWidth="md" className="pt-50 just-center">
        Users History
      </Container>
    );
  }
}
