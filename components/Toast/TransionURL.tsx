import AccountContext from "@/context/AccountContext";
import React, { useContext } from "react";
interface TransitionURLProps {
  type: string;
  transactionHash: string;
}
const TransitionURL: React.FC<TransitionURLProps> = ({ type, transactionHash }) => {
  const { demask } = useContext(AccountContext);
  return (
    <a href={`${demask.urltxHash}${transactionHash}`} target="_blank">
      {type} success. View your transaction
    </a>
  );
}
export default TransitionURL;