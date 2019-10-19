import axios from 'axios';

const getInstance = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:4000/',
  });
  instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
  return instance;
};

export const getNonce = (publicAddress: string): Promise<void> => {
  const instance = getInstance();

  return instance.post('/sign-up-address', {public_address: publicAddress}).then(response => {
    if (!response) {
      return 'error';
    }
    return response.data;
  });
};

export const verifySignMessage = (publicAddress: string, signature: string, message: string) => {
  const instance = getInstance();

  return instance.post('/verify-signature', {
    public_address: publicAddress,
    message: message,
    signature: signature,
  }).then(response => {
    if (!response) {
      return 'error';
    }
    return response.data;
  });
};

interface WalletData {
  publicAddress: string;
  networkVersion: string;
}

interface SignData {
  data: string;
  sig: string;
}

export const signMessage = (publicAddress: string, message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const web3 = new Web3(window.ethereum);
    const msg = message;
    const params = [msg, publicAddress];

    web3.currentProvider.sendAsync({
      method: 'personal_sign',
      params,
      from: publicAddress,
    }, function (err: Error, result: any) {
      if (err) return console.error(err);
      if (result.error) return console.error(result.error);
      console.log('PERSONAL SIGNED:' + JSON.stringify(result.result));
      console.log(result);

      let msgParams = { data: msg, sig: result.result };
      console.log(msgParams);

      // @ts-ignore
      resolve(msgParams);
      //
      // const method = 'personal_ecRecover';
      // var params = [msg, result.result];
      // web3.currentProvider.sendAsync({
      //   method,
      //   params,
      //   from,
      // }, function (err: Error, result: any) {
      //   var recovered = result.result;
      //   console.log('ec recover called back:');
      //   console.dir({ err, recovered });
      //   if (err) return console.error(err);
      //   if (result.error) return console.error(result.error);
      //
      //
      //   if (recovered === publicAddress ) {
      //     console.log('Successfully ecRecovered signer as ' + from)
      //   } else {
      //     console.log('Failed to verify signer when comparing ' + result + ' to ' + from)
      //   }
      // })
    });
  })
};

export const fetchWallet = (): Promise<WalletData> => {
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);

      // @ts-ignore
      window.ethereum.enable().catch(error => {
        // User denied account access
        reject(error);
      });

      if (web3 && web3.currentProvider && web3.currentProvider.selectedAddress) {
        resolve({publicAddress: web3.currentProvider.selectedAddress, networkVersion: web3.currentProvider.networkVersion});
      } else {
        resolve({publicAddress: '', networkVersion: ''});
      }
    } catch (e) {
      resolve({publicAddress: '', networkVersion: ''});
    }
  })
};

export const fetchWalletData = (): Promise<WalletData> => {
  return new Promise((resolve, _reject) => {
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);

      if (web3 && web3.currentProvider && web3.currentProvider.selectedAddress) {
        resolve({publicAddress: web3.currentProvider.selectedAddress, networkVersion: web3.currentProvider.networkVersion});
      } else {
        resolve({publicAddress: '', networkVersion: ''});
      }
    } catch (e) {
      resolve({publicAddress: '', networkVersion: ''});
    }
  })
};

export const hasProvider = (): Promise<boolean> => {
  return new Promise((resolve, _reject) => {
    try {
      // @ts-ignore
      const web3 = new Web3(window.ethereum);

      if (web3 && web3.currentProvider) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      resolve(false);
    }
  })
};
