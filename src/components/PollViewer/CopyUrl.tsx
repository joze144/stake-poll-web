import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clipboardCopy from 'clipboard-copy';
import LinkIcon from '@material-ui/icons/Link';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  shareButton: {
    margin: 5,
    cursor: 'pointer',
    "&:hover": {
      opacity: 0.75,
    },
  },
});

interface CopyUrlProps {
  url: string
}

export default function CopyUrl({url}: CopyUrlProps) {
  const classes = useStyles();

  const [copied, setCopied] = useState(false);

  function copyToClipboard(e: any) {
    clipboardCopy(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Tooltip open={copied} title="URL Copied!">
      <LinkIcon fontSize="large" className={classes.shareButton} onClick={copyToClipboard} />
    </Tooltip>
  );
}
