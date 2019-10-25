import { getInstance } from '../httpService';

export const verifySignMessage = ({data, sig, publicAddress}: SignData) => {
  const instance = getInstance();

  return instance.post('/verify-signature', {
    public_address: publicAddress,
    message: data,
    signature: sig,
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
  publicAddress: string;
}

export const signMessage = (publicAddress: string, message: string): Promise<SignData> => {
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
      if (err) reject(err);
      if (result.error) reject(result.error);

      let msgParams = { data: msg, sig: result.result, publicAddress: publicAddress };

      resolve(msgParams);
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
