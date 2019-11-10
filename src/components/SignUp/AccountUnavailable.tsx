import React from 'react';
import { IconNoWeb3 } from './IconNoWeb3';
import { Typography } from '@material-ui/core';

const AccountUnavailable = () => (
  <div>
    <Typography align="center" component="h5" variant="h4" color="textPrimary">
      No ETH Account
    </Typography>
    <div className="web3-Provider-image mt-20">
      <IconNoWeb3 />
    </div>
  </div>
);

export default AccountUnavailable;
