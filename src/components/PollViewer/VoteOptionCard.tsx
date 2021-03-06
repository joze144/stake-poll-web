import React from 'react';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Card from '@material-ui/core/Card/Card';
import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme, VoteOptionCardProps>(theme => {
  return {
    card: {
      minWidth: 275,
      marginTop: '5px',
    },
    cardNoResults: {
      minWidth: 275,
      marginTop: '5px',
    },
    cardChosen: {
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.light,
      borderWidth: '1px 1px 1px 1px',
    },
    contentNoResults: {
      flex: '4',
    },
    content: props => ({
      flex: '4',
      background: 'linear-gradient(90deg, ' + theme.palette.secondary.light + ' ' +
        props.percentage + '%, ' + theme.palette.primary.main + ' ' +
        Math.min(100, (props.percentage + 1)) + '%)',
    }),
    contentNotStaked: props => ({
      flex: '4',
      background: 'linear-gradient(90deg, ' + theme.palette.secondary.light + ' ' +
        props.votersPercentage + '%, ' + theme.palette.primary.main + ' ' +
        Math.min(100, (props.votersPercentage + 1)) + '%)',
    }),
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    cover: {
      flex: '1',
      textAlign: 'right',
      verticalAlign: 'middle',
      padding: '5px',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
    }
  }
});

interface VoteOptionCardProps {
  id: string,
  index: number;
  canVote: boolean;
  content: string;
  chosen: boolean;
  hideResults: boolean;
  stakedResults: boolean;
  percentage: number;
  votersPercentage: number;
  tokenAmount: number;
  votersAmount: number;
  vote(optionId: string): void;
}

export default function VoteOptionCard(props: VoteOptionCardProps) {
  const {id, index, canVote, chosen, content, hideResults, percentage, votersPercentage, stakedResults, tokenAmount, votersAmount, vote} = props;
  const classes = useStyles(props);
  const cardStyle = hideResults ? classes.cardNoResults : chosen ? [classes.card, classes.cardChosen].join(' ') : classes.card;
  const contentStyle = hideResults ? classes.contentNoResults : stakedResults ? classes.content : classes.contentNotStaked;
  const cardPercentage = stakedResults ? percentage : votersPercentage;
  const title = canVote ? "Vote" : hideResults ? "Log in to vote" : cardPercentage + "%";
  const amountText = stakedResults ? tokenAmount / 1000 + ' ETH' : [0, 1].indexOf(votersAmount) !== -1 ? votersAmount + ' Vote' : votersAmount + ' Votes';

  let card = (
    <Card className={cardStyle}>
      <CardActionArea className={classes.button} onClick={() => vote(id)} disabled={!canVote}>
        <CardContent className={contentStyle}>
          <Typography variant="body1" color="textPrimary">
            {index}. {content}
          </Typography>
        </CardContent>
        <CardContent className={classes.cover}>
          <Typography variant="body1" color="textSecondary">
            {amountText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  if (hideResults) {
    card = (
      <Card className={cardStyle}>
        <CardActionArea onClick={() => vote(id)} disabled={!canVote}>
          <CardContent className={contentStyle}>
            <Typography variant="body1" color="textPrimary">
              {index}. {content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  return (
    <Tooltip title={title}>
      {card}
    </Tooltip>
  )
}
