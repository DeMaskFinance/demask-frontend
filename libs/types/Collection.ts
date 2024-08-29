interface InitialValues {
  avatar: string;
  contractName: string;
  category: string[];
  symbol: string;
  description?: string;
}
interface CollectionProps {
  url: string;
  name: string;
  collectionAddress: string;
  collectionId?: number;
  symbol?: string;
  type?: string;
}
