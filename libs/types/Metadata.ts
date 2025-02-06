interface MetadataAttribute {
  trait_type: string;
  value: string;
}

interface Metadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: MetadataAttribute[];
  category: string[];
}
interface CollectionInterface {
  name?: string;
  description?: string;
  url?: string;
  category?: string[];
  collaborators?: string[];
  socials?: Socials;
  creatorEarning?: string;
  featureImage?: string;
  royalty?: string;
}
interface UploadFileProps {
  setFileIPFS: React.Dispatch<React.SetStateAction<string>>;
  fileType: string;
  selectedFile: string | null;
  setFileType: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  uploadFile: (file: File) => Promise<string> | any;
}
interface ModalDetailProps {
  type: string;
  nftAddress: string;
  nftID: string;
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDetail: boolean;
}
