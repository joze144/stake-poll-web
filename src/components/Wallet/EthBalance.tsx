import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { IWalletStore } from './walletStore';
import { Typography, withStyles } from '@material-ui/core';

const styles = () => ({
  content: {
    margin: 10
  },
});

interface EthBalanceProps {
  walletStore?: IWalletStore;
  classes: any;
}

@inject('walletStore')
@observer
class EthBalance extends Component<EthBalanceProps> {
  constructor(props: EthBalanceProps) {
    super(props);
  }

  render() {
    return (
      <Typography className={this.props.classes.content} variant="body1" color="textSecondary">
        Stake Balance: {this.props.walletStore!.ethBalance / 1000} ETH
      </Typography>
    );
  }
}

export default withStyles(styles)(EthBalance);
