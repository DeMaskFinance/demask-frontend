import AccountContext from "@/context/AccountContext";
import React, { useContext } from "react";
interface TransitionURLProps {
  type: string;
  transactionHash: string;
}
const TransitionURL: React.FC<TransitionURLProps> = ({ type, transactionHash }) => {
  const { demask } = useContext(AccountContext);
  return (
    <a href={`${demask.urltxHash}tx/${transactionHash}`} target="_blank">
      {type}. View your transaction
    </a>
  );
}
export default TransitionURL;