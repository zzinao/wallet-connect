import { Web3Wallet } from '@walletconnect/web3wallet';
import { Core } from '@walletconnect/core';
import { ethers } from 'ethers';

export const createWeb3Wallet = async () => {
  const projectId = import.meta.env.VITE_PROJECT_ID as string;

  if (!projectId) return;

  const core = new Core({
    projectId,
    // logger: 'trace',
  });
  const web3Wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'Poodle Wallet',
      description: '앙금이!',
      url: 'https://namu.wiki/w/%ED%91%B8%EB%93%A4',
      icons: [
        'https://i.namu.wiki/i/j2Gz_JHE5A1MlSaglc2dyOecDVT0FXdjUbdzkPEjndZ9gsERUnl0G6rDs8d0LyOf2WeS71GS1yokVhs4EEcLVw.webp',
      ],
    },
  });
  return web3Wallet;
};

export const generateAccount = () => {
  let privateKey = localStorage.getItem('WALLET_PRIVATE_KEY') as `0x${string}` | undefined;

  if (!privateKey) {
    const randomWallet = ethers.Wallet.createRandom();
    localStorage.setItem('WALLET_PRIVATE_KEY', randomWallet.privateKey);
    const wallet = new ethers.Wallet(randomWallet.privateKey);
    return wallet;
  } else {
    const wallet = new ethers.Wallet(privateKey);
    return wallet;
  }
};
