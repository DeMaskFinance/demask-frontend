import Web3 from "web3";
import Web3Modal from 'web3modal';
export const disconnectWalletTest = async () => {
  if (window.ethereum) {
    try {
      // Reset giá trị provider, chainId và selectedAccount về null
      await window.ethereum.disconnect();
      // window.ethereum.provider = null;
      // window.ethereum.chainId = null;
      // window.ethereum.selectedAddress = null;
      console.log('Disconnected from account');
      // Cập nhật trạng thái account (nếu cần)
    } catch (error) {
      console.error('Failed to disconnect account:', error);
    }
  } else {
    console.log('Web3 provider not found');
  }
};
