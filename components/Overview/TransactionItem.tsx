import { FunctionComponent } from "react";

interface TransactionItemProps {}

const TransactionItem: FunctionComponent<TransactionItemProps> = () => {
  return (
    <tr className="flex w-full px-8 pt-4 text-left text-dark2">
      <th className="flex flex-1 font-normal gap-x-6">
        <p>1</p>
        <p>Swap NFT 1 for USDT</p>
      </th>
      <th className="w-[296px] font-normal">890</th>
      <th className="w-[316px] font-normal">$64,840</th>
      <th className="w-[296px] font-normal">0x93..3874</th>
      <th className="w-[125px] font-normal">5 minutes ago</th>
    </tr>
  );
};

export default TransactionItem;
