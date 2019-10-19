import React, { SyntheticEvent } from 'react';
import clsx from 'clsx';
import { IconButton, makeStyles, Snackbar, SnackbarContent, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { green } from '@material-ui/core/colors';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon,
};

const useStyles2 = makeStyles((theme: Theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const useStyles1 = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export interface Props {
  className?: string;
  message?: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
}

function MySnackbarContentWrapper(props: Props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

interface ConnectedSnackbarProps {
  connected: boolean;
  time: number;
}

export default function ConnectedSnackbar({ connected, time }: ConnectedSnackbarProps) {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(!connected);

  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(!connected);
  };

  const message = connected ? 'Connected in ' + time + 'ms.' : 'Connecting to server...';
  const variant = connected ? 'success' : 'error';

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <MySnackbarContentWrapper variant={variant} className={classes.margin} message={message} onClose={handleClose} />
    </Snackbar>
  );
}
