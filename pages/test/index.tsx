import { WalletButton } from '@rainbow-me/rainbowkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
const TestComponent = () => {
  return (
    <>
      <WalletButton wallet="rainbow" />
      <WalletButton wallet="metamask" />
      <WalletButton wallet="coinbase" />
    </>
  );
};

export default TestComponent;