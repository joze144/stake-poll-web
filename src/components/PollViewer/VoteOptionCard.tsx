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
    card: props => ({
      display: 'flex',
      minWidth: 275,
      background: 'linear-gradient(90deg, ' + theme.palette.secondary.light + ' ' +
        props.percentage + '%, ' + theme.palette.primary.main + ' ' +
        Math.min(100, (props.percentage + 1)) + '%)',
      marginTop: '5px',
    }),
    cardNoResults: {
      display: 'flex',
      minWidth: 275,
      marginTop: '5px',
    },
    cardChosen: {
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.light,
      borderWidth: '1px 1px 1px 1px',
    },
    content: {
      flex: '1 0 auto',
    },
  }
});

interface VoteOptionCardProps {
  id: string,
  index: number;
  canVote: boolean;
  content: string;
  chosen: boolean;
  hideResults: boolean;
  percentage: number;
  vote(optionId: string): void;
}

export default function VoteOptionCard(props: VoteOptionCardProps) {
  const {id, index, canVote, chosen, content, hideResults, percentage, vote} = props;
  const classes = useStyles(props);
  const cardStyle = hideResults ? classes.cardNoResults : chosen ? [classes.card, classes.cardChosen].join(' ') : classes.card;
  const title = canVote ? "Vote" : hideResults ? "Log in to vote" : percentage + "%";
  return (
    <Tooltip title={title}>
      <Card className={cardStyle}>
        <CardActionArea onClick={() => vote(id)} disabled={!canVote}>
          <CardContent className={classes.content}>
            <Typography variant="body1" color="textPrimary">
              {index}. {content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  )
}
