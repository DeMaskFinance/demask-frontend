import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethereumjs-util";
import data from "@/libs/utils/data.json";

interface Balance {
  address: string;
  amount: string;
  proof?: string[];
}

const typedData: Balance[] = data as Balance[];

const leaves = typedData.map((balance) =>
  keccak256(
    Buffer.concat([
      Buffer.from(balance.address.replace("0x", ""), "hex"),
      Buffer.from(balance.amount.replace("0x", ""), "hex"),
    ])
  )
);

const tree = new MerkleTree(leaves, keccak256, { sort: true });

export function run(): Balance[] {
  return typedData.map((item, idx) => {
    try {
      item.proof = tree.getHexProof(leaves[idx]);
      return item;
    } catch (error) {
      console.error("Error generating proof for index", idx, ":", error);
      return { ...item, proof: [] };
    }
  });
}
