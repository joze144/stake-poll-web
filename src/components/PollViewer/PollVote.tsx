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
  let n = 0;
  const optionCards = options.map(({id, content, percentage, weight, numberOfVoters}: PollOptionResult) => {
    n++;
    const chosen = !!(chosenOptionId && chosenOptionId === id);
    return (<VoteOptionCard key={id} index={n} tokenAmount={weight} votersAmount={numberOfVoters} canVote={canVote} hideResults={hideResults} percentage={percentage} id={id} chosen={chosen} content={content} vote={voteOnPoll}/>)
  });

  return (
    <Box>
      {optionCards}
    </Box>
  )
}
