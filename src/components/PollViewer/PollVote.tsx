import React from 'react';
import { PollOptionResult } from './pollViewerStore';
import VoteOptionCard from './VoteOptionCard';
import Button from '@material-ui/core/Button/Button';
import Box from '@material-ui/core/Box/Box';
import Typography from '@material-ui/core/Typography/Typography';

interface PollVoteProps {
  canVote: boolean;
  title: string;
  options: Array<PollOptionResult>;
  chosenOptionId: string | null;
  voteOnPoll(pollOptionId: string): void;
}

export default function PollVote({chosenOptionId, options, title, voteOnPoll}: PollVoteProps) {
  const optionCards = options.map(({id, content, percentage}: PollOptionResult) => {
    const chosen = !!(chosenOptionId && chosenOptionId === id);
    return (<VoteOptionCard key={id} percentage={percentage} id={id} chosen={chosen} content={content} vote={voteOnPoll}/>)
  });

  return (
    <Box className="just-center box-cool" alignItems="center" p={2} m={3}>
      <Typography color="textSecondary" gutterBottom>
        Poll Voting for poll {title}
      </Typography>
      <Box>
        {optionCards}
      </Box>
      <Button>See results</Button>
    </Box>
  )
}
