import React from 'react';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Card from '@material-ui/core/Card/Card';
import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme, VoteOptionCardProps>(_theme => {
  return {
    card: props => ({
      display: 'flex',
      minWidth: 275,
      background: 'linear-gradient(90deg, #FFC0CB ' + props.percentage + '%, #F5F5F5 ' + Math.min(100, (props.percentage + 5)) + '%)',
    }),
    content: {
      flex: '1 0 auto',
    },
  }
});

interface VoteOptionCardProps {
  id: string,
  content: string;
  chosen: boolean;
  percentage: number;
  vote(optionId: string): void;
}

export default function VoteOptionCard(props: VoteOptionCardProps) {
  const {id, chosen, content, vote} = props;
  const classes = useStyles(props);

  return (
    <Tooltip title="Vote">
      <Card className={classes.card}>
        <CardActionArea onClick={() => vote(id)}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  )
}
