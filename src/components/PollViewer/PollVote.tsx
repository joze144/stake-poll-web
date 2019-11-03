import React from 'react';
import { PollOptionResult } from './pollViewerStore';
import VoteOptionCard from './VoteOptionCard';
import Box from '@material-ui/core/Box/Box';
import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  topText: {
    borderColor: '#D5D5D5',
    borderStyle: 'solid',
    borderWidth: '0px 0px 2px 0px',
  },
});

interface PollVoteProps {
  canVote: boolean;
  hideResults: boolean;
  title: string;
  options: Array<PollOptionResult>;
  chosenOptionId: string | null;
  voteOnPoll(pollOptionId: string): void;
}

export default function PollVote({canVote, chosenOptionId, hideResults, options, title, voteOnPoll}: PollVoteProps) {
  const classes = useStyles();
  const optionCards = options.map(({id, content, percentage}: PollOptionResult) => {
    const chosen = !!(chosenOptionId && chosenOptionId === id);
    return (<VoteOptionCard key={id} canVote={canVote} hideResults={hideResults} percentage={percentage} id={id} chosen={chosen} content={content} vote={voteOnPoll}/>)
  });

  return (
    <Box className="just-center box-cool" alignItems="center" p={2}>
      <Typography className={classes.topText} component="h5" variant="h5" gutterBottom>
        Question: {title}
      </Typography>
      <Box m={3}>
        {optionCards}
      </Box>
    </Box>
  )
}
