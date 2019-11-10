import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '@material-ui/core';
import { IHistoryStore } from './historyStore';
import { IAuthStore } from '../SignUp/authStore';
import HistoryEntry from './HistoryEntry';
import { IRouterStore } from '../Router/routerStore';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = () => ({
  fab: {
    margin: 5,
  },
});

interface HistoryProps {
  authStore?: IAuthStore;
  historyStore?: IHistoryStore;
  routerStore?: IRouterStore;
  classes: any;
}

@inject('historyStore', 'routerStore')
@observer
class HistoryPage extends Component<HistoryProps> {
  constructor(props: HistoryProps) {
    super(props);
  }

  componentDidMount(): void {
    this.props.historyStore!.onPage(true);
    this.props.historyStore!.loadUserHistory(1);
  }

  componentWillUnmount(): void {
    this.props.historyStore!.onPage(false);
  }

  _navigate = (pollId: string) => {
    // @ts-ignore
    this.props.routerStore!.history.push('/poll/' + pollId);
  };

  _loadMore = () => {
    this.props.historyStore!.loadUserHistory(this.props.historyStore!.lastLoadedPage + 1);
  };

  render() {
    const loading = this.props.historyStore!.loading;
    const canLoadMore = this.props.historyStore!.totalPages ? this.props.historyStore!.lastLoadedPage < this.props.historyStore!.totalPages : false;
    const cards = this.props.historyStore!.historyEntries.map(({pollId, title, chosenOptionContent, timestamp}) => {
      return (<HistoryEntry key={pollId} pollId={pollId} title={title} chosenContent={chosenOptionContent} navigate={this._navigate} timestamp={timestamp} />)
    });
    let progress = loading ? (<LinearProgress variant="query" />) : (<span />);
    let loadMore = canLoadMore ? (
      <Box textAlign="center">
      <Tooltip title="Load more">
        <Fab color="secondary" aria-label="show more" className={this.props.classes.fab} onClick={this._loadMore}>
          <ExpandMoreIcon />
        </Fab>
      </Tooltip>
      </Box>
    ) : (<span />);
    return (
      <Container component="main" maxWidth="md" className="pt-40 just-center">
        <Box textAlign="center">
          <Typography variant="h3" color="textPrimary">
            Poll History
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Review polls where you participated
          </Typography>
        </Box>
        {progress}
        {cards}
        {loadMore}
      </Container>
    );
  }
}

export default withStyles(styles)(HistoryPage);
