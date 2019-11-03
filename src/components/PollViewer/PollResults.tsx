import React from 'react';
import { PollOptionResult } from './pollViewerStore';

interface PollResultsProps {
  title: string;
  options: Array<PollOptionResult>;
  chosenOption: PollOptionResult | null;
}

export default function PollResults({title}: PollResultsProps) {
  return (
    <div>
      Poll results for poll {title}
    </div>
  )
}
