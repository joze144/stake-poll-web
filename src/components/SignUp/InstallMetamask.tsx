import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea/CardActionArea';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    margin: '10px',
  },
  author: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface InstallMetaMaskProps {
  onLogin(): void;
}

export default function InstallMetaMask({onLogin}: InstallMetaMaskProps) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => onLogin()}>
        <CardContent>
          <img className="meta-mask-img" src="https://cdn-sgp.selectdc.net/a9419475-f6d3-11e9-aee6-b26519d963ec.png" />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
