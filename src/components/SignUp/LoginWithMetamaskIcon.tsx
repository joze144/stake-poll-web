import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      width: 300,
      textAlign: 'center',
    },
    image: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      height: 200,
    },
    details: {
      textAlign: 'center',
    },
  }),
);

interface LoginWithMetamaskIconProps {
  text: string,
  onLogin(): void;
}

export default function LoginWithMetamaskIcon({text, onLogin}: LoginWithMetamaskIconProps) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => onLogin()}>
        <CardMedia
          className={classes.image}
          image="/src/images/metaH.png"
          title={text}
        />
        <div className={classes.details}>
          <CardContent>
            <Typography component="h5" variant="h5">
              {text}
            </Typography>
          </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
}
