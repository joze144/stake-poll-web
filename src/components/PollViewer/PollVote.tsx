import React from 'react';
import { PollOptionResult } from './pollViewerStore';
import VoteOptionCard from './VoteOptionCard';
import Box from '@material-ui/core/Box/Box';

interface PollVoteProps {
  canVote: boolean;
  hideResults: boolean;
  options: Array<PollOptionResult>;
  chosenOptionId: string | null;
  voteOnPoll(pollOptionId: string): void;
}

export default function PollVote({canVote, chosenOptionId, hideResults, options, voteOnPoll}: PollVoteProps) {
  const optionCards = options.map(({id, content, percentage}: PollOptionResult) => {
    const chosen = !!(chosenOptionId && chosenOptionId === id);
    return (<VoteOptionCard key={id} canVote={canVote} hideResults={hideResults} percentage={percentage} id={id} chosen={chosen} content={content} vote={voteOnPoll}/>)
  });

  return (
    <Box p={3}>
      {optionCards}
    </Box>
  )
}
