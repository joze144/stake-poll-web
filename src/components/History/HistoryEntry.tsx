import React from 'react';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Card from '@material-ui/core/Card/Card';
import Typography from '@material-ui/core/Typography/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme, HistoryEntryProps>(_theme => {
  return {
    card: props => ({
      display: 'flex',
      minWidth: 275,
      marginTop: '5px',
    }),
    content: {
      flex: '1 0 auto',
    },
    option: {
      fontSize: 10,
    },
  }
});

interface HistoryEntryProps {
  pollId: string,
  title: string;
  chosenContent: string | null;
  timestamp: Date;
  navigate(pollId: string): void;
}

export default function HistoryEntry(props: HistoryEntryProps) {
  const {pollId, title, chosenContent, navigate} = props;
  let voted = !!chosenContent ? chosenContent : '/';
  const classes = useStyles(props);
  return (
    <Tooltip title={title}>
      <Card className={classes.card}>
        <CardActionArea onClick={() => navigate(pollId)}>
          <CardContent className={classes.content}>
            <Typography variant="body1" color="textPrimary">
              Question: {title}
            </Typography>
            <Typography className={classes.option} color="textSecondary" gutterBottom>
              You voted: {voted}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  )
}
