export const disconnectWallet = async () => {
  console.log("asd");

  if (window.ethereum && window.ethereum.isMetaMask) {
    try {
        await window.ethereum.close();
      console.log("Disconnected from MetaMask");
      // Cập nhật trạng thái account (nếu cần)
    } catch (error) {
      console.error("Failed to disconnect MetaMask:", error);
    }
  } else {
    console.log("MetaMask provider not found");
  }
};
