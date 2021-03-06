import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    minWidth: 250,
    width: '100%',
    marginTop: '5px',
  },
  content: {
    flex: '1 0 auto',
  },
});

interface PollOptionCardProps {
  id: string;
  index: number;
  content: string;
  deleteOption(id: string): void;
}

export default function PollOptionCard({id, index, content, deleteOption}: PollOptionCardProps) {
  const classes = useStyles();

  return (
    <Tooltip title="Delete">
      <Card className={classes.card}>
        <CardActionArea onClick={() => deleteOption(id)}>
          <CardContent className={classes.content}>
            <Typography variant="body1" color="textPrimary" gutterBottom>
              {index}. {content}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
}
