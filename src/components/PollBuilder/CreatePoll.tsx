import React, { Component, FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { ICreatePollStore } from './createPollStore';
import Box from '@material-ui/core/Box/Box';
import PollOptionCard from './PollOptionCard';
import TextField from '@material-ui/core/TextField/TextField';
import RadioGroup from '@material-ui/core/RadioGroup/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import StyledRadio from './StyledRadio';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

interface CreatePollProps {
  createPollStore?: ICreatePollStore;
}

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

  _pollTypeChange = (e: any) => {
    this.props.createPollStore!.typeChange(e.target.value);
  };

  _createPoll = () => {
    this.props.createPollStore!.submitPoll();
  };

  render() {
    const loading = this.props.createPollStore!.loading;
    const error = this.props.createPollStore!.error;
    const options = this.props.createPollStore!.options;

    let progress = loading ? (<LinearProgress variant="query" />) : (<span />);

    const optionCards = [];
    for (let n = 0; n < options.length; n++) {
      const {id, content} = options[n];
      optionCards.push(<PollOptionCard key={id} id={id} index={n} content={content} deleteOption={this._deleteOption} />)
    }

    return (
      <Box className="just-center box-cool" alignItems="center" p={2} m={3}>
        {progress}
        <Box m={2}>
          <TextField
            margin="normal"
            fullWidth
            label="Enter Poll Question"
            value={this.props.createPollStore!.title}
            inputProps={{ maxLength: 100 }}
            onChange={this._titleChange}
            autoFocus />
        </Box>
        <Box>
          {optionCards}
        </Box>
        <form onSubmit={this._addOption}>
          <TextField
            margin="normal"
            fullWidth
            label="Enter Poll Option"
            value={this.props.createPollStore!.newOptionContent}
            inputProps={{ maxLength: 100 }}
            onChange={this._newOptionChange}
            autoFocus
          />
          <br />
          <br />
          <Typography color="textSecondary" gutterBottom>
            Poll type
          </Typography>
          <RadioGroup defaultValue="stake" aria-label="type" name="customized-radios" onChange={this._pollTypeChange}>
            <FormControlLabel value="stake" control={<StyledRadio />} label="Staked Count" />
            <FormControlLabel value="equal" control={<StyledRadio />} label="Equal Count" />
          </RadioGroup>
        </form>
        <Typography color="textSecondary" gutterBottom>
          {error}
        </Typography>
        <Box textAlign="center" m={3}>
          <Button className="btn-s" variant="contained" disabled={loading} color="primary" onClick={this._createPoll}>Create Poll</Button>
        </Box>
      </Box>
    )
  }
}

export default CreatePoll;
