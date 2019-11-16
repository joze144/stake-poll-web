import React from 'react';
import { PollOptionResult } from './pollViewerStore';
import { Box } from '@material-ui/core';
import { ResponsivePie } from '@nivo/pie'

interface PollResultsProps {
  options: Array<PollOptionResult>;
  chosenOption: PollOptionResult | null;
}

export default function PollResults({options}: PollResultsProps) {
  const data = prepareData(options);
  const chart = data.length > 0 ? (
    <Box textAlign="center" alignItems="center" alignContent="center" className="charts">
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: 'nivo' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: 'color' }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#333333"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          translateY: 56,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000'
              }
            }
          ]
        }
      ]}
    />
    </Box>
  ) : (<span />);

  return (
    <Box>
      {chart}
    </Box>
  )
}

function prepareData(options: Array<PollOptionResult>): any {
  let n = 0;
  return options.map(({content, percentage}) => {
    n++;
    return {id: n.toString(), value: percentage, label: content};
  }).filter(({value}) => value > 0);
}
