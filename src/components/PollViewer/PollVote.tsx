import React from 'react';
import { PollOptionResult } from './pollViewerStore';
import VoteOptionCard from './VoteOptionCard';
import Box from '@material-ui/core/Box/Box';

interface PollVoteProps {
  canVote: boolean;
  hideResults: boolean;
  options: Array<PollOptionResult>;
  stakedResults: boolean;
  chosenOptionId: string | null;
  voteOnPoll(pollOptionId: string): void;
}

export default function PollVote({canVote, chosenOptionId, hideResults, options, stakedResults, voteOnPoll}: PollVoteProps) {
  let n = 0;
  const optionCards = options.map(({id, content, percentage, percentageVoters, weight, numberOfVoters}: PollOptionResult) => {
    n++;
    const chosen = !!(chosenOptionId && chosenOptionId === id);
    return (<VoteOptionCard key={id} index={n} stakedResults={stakedResults} tokenAmount={weight} votersAmount={numberOfVoters} canVote={canVote} hideResults={hideResults} percentage={percentage} votersPercentage={percentageVoters} id={id} chosen={chosen} content={content} vote={voteOnPoll}/>)
  });

  return (
    <Box>
      {optionCards}
    </Box>
  )
}
