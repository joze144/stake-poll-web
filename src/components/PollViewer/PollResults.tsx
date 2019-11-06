import React from 'react';
// @ts-ignore
import * as ReactVis from 'react-vis-types';
import { PollOptionResult } from './pollViewerStore';
import { RadialChart, makeVisFlexible } from 'react-vis';

interface PollResultsProps {
  title: string;
  options: Array<PollOptionResult>;
  chosenOption: PollOptionResult | null;
}

export default function PollResults({options, title}: PollResultsProps) {
  const myData = options.map(({content, percentage}) => {
    return {angle: percentage, label: content};
  });
  const FlexRadialChart = makeVisFlexible(RadialChart);
  return (
    <div className="charts">
      Poll results for poll {title}

      <FlexRadialChart
        data={myData}
        width={300}
        height={300}
      />
    </div>
  )
}
