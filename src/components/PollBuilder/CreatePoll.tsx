import React, { Component, FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { ICreatePollStore } from './createPollStore';
import Box from '@material-ui/core/Box/Box';
import PollOptionCard from './PollOptionCard';
import TextField from '@material-ui/core/TextField/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { Container, withStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

interface CreatePollProps {
  createPollStore?: ICreatePollStore;
  classes: any;
}

const styles = () => ({
  fab: {
    margin: 5,
  },
});

@inject('createPollStore')
@observer
class CreatePoll extends Component<CreatePollProps> {
  constructor(props: CreatePollProps) {
    super(props);
  }

  _addOption = (event: FormEvent) => {
    this.props.createPollStore!.addOption();
    event.preventDefault();
  };

  _newOptionChange = (e: any) => {
    this.props.createPollStore!.optionChange(e.target.value);
  };

  _titleChange = (e: any) => {
    this.props.createPollStore!.titleChange(e.target.value);
  };

  _deleteOption = (id: string) => {
    this.props.createPollStore!.removeOption(id);
  };

  _clearAll = () => {
    this.props.createPollStore!.clearAll();
  };

  _confirmTitle = (e: any) => {
    this.props.createPollStore!.confirmTitle();
    if (e) {
      e.preventDefault();
    }
  };

  _createPoll = () => {
    this.props.createPollStore!.submitPoll();
  };

  render() {
    const step = this.props.createPollStore!.step;
    const loading = this.props.createPollStore!.loading;
    const error = this.props.createPollStore!.error;
    const options = this.props.createPollStore!.options;

    let top = null;
    let content = null;
    let grid = null;
    if (step === 1) {
      top = (<Box textAlign="center">
        <Typography variant="h3" color="textPrimary">
          Ask a Question
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Get an instant feedback!
        </Typography>
      </Box>);
      content = (<Box className="just-center">
        <form onSubmit={this._confirmTitle}>
          <TextField
            margin="normal"
            fullWidth
            label="Enter Your Question"
            value={this.props.createPollStore!.title}
            inputProps={{ maxLength: 100 }}
            onChange={this._titleChange}
            autoFocus />
        </form>
      </Box>);

      const disabled = !this.props.createPollStore!.title;
      grid = (<Box textAlign="center">
        <Fab disabled={disabled} color="secondary" aria-label="next" className={this.props.classes.fab} onClick={this._confirmTitle}>
          <NavigateNextIcon />
        </Fab>
      </Box>)
    } else {
      const optionCards = [];
      for (let n = 0; n < options.length; n++) {
        const {id, content} = options[n];
        optionCards.push(<PollOptionCard key={id} id={id} index={n} content={content} deleteOption={this._deleteOption} />)
      }

      top = (<Box textAlign="center">
        <Typography variant="h3" color="textPrimary">
          {this.props.createPollStore!.title}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Add Some Options!
        </Typography>
      </Box>);

      content = (<Box className="just-center">
          <Box alignItems="center" p={2}>
            {optionCards}
          </Box>
          <form onSubmit={this._addOption}>
            <TextField
              margin="normal"
              fullWidth
              label="Enter New Option"
              value={this.props.createPollStore!.newOptionContent}
              inputProps={{ maxLength: 100 }}
              onChange={this._newOptionChange}
              autoFocus
            />
          </form>
        </Box>
      );

      const disabled = optionCards.length < 2;
      grid = (<Box textAlign="center">
        <Fab color="secondary" aria-label="clear" className={this.props.classes.fab} onClick={this._clearAll}>
          <ClearIcon />
        </Fab>
        <Fab disabled={disabled} color="secondary" aria-label="done" className={this.props.classes.fab} onClick={this._createPoll}>
          <DoneIcon />
        </Fab>
      </Box>)
    }

    let progress = loading ? (<LinearProgress variant="query" />) : (<span />);

    return (
      <Container component="main" maxWidth="md" className="pt-50 just-center">
        {top}
        <Box alignItems="center">
          {progress}
          {content}
          {grid}
          <Typography color="textSecondary" gutterBottom>
            {error}
          </Typography>
        </Box>
      </Container>
    )
  }
}

export default withStyles(styles)(CreatePoll);
