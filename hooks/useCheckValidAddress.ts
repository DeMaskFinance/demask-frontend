import Web3 from "web3";

// Khởi tạo Web3
const web3 = new Web3(Web3.givenProvider);

// Hàm kiểm tra tính hợp lệ của địa chỉ Ethereum
export default function isValidEthereumAddress(address: string) {
  if (web3.utils.isAddress(address)) {
    return true;
  } else {
    return false;
  }
}
