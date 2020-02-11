import React from 'react';
import { IconNoWeb3 } from './IconNoWeb3';
import { Typography } from '@material-ui/core';

const AccountUnavailable = () => (
  <div>
    <Typography align="center" component="h5" variant="h5" color="textPrimary">
      Your browser doesn't have an Ethereum wallet.
    </Typography>
    <div className="web3-Provider-image m-20">
      <IconNoWeb3 />
    </div>
  </div>
);

export default AccountUnavailable;
