import {
  uploadFileIPFSMint,
  uploadMetadata,
  uploadMetadataIPFS,
} from "../service/IPFSService";

interface MetadataProps {
  attributeItems?: object[];
  fileType: string;
  fileIPFS: any;
  name: string;
  symbol: string;
  description: string;
}

const createInitialMetadata = (
  name: string,
  symbol: string,
  description: string,
  fileIPFS: string,
  fileType: string
) => {
  const metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
    animation_url: string;
    attributes?: object[];
  } = {
    name,
    symbol,
    description,
    image: "",
    animation_url: "",
  };

  if (fileType.startsWith("video/")) {
    metadata.animation_url = fileIPFS;
  } else if (fileType.startsWith("audio/")) {
    metadata.image = ""; // This will be set later in audio case
    metadata.animation_url = fileIPFS;
  } else {
    metadata.image = fileIPFS;
  }

  return metadata;
};

const handleAudioFile = async () => {
  const imagePath = "/images/audio.svg";
  const response = await fetch(imagePath);
  const blob = await response.blob();
  const file = new File([blob], "audio.svg", { type: "image/svg+xml" });
  const audioImage = await uploadFileIPFSMint(file);
  return audioImage || "";
};

const getMetadataUrlEVM = async ({
  attributeItems = [],
  fileType,
  fileIPFS,
  name,
  symbol,
  description,
}: MetadataProps) => {
  const attributesMetadata = attributeItems
    .map(({ trait_type, value }: any) => ({ trait_type, value }))
    .filter(
      (attribute) => attribute.trait_type !== "" || attribute.value !== ""
    );

  const initialMetadata = createInitialMetadata(
    name,
    symbol,
    description,
    fileIPFS,
    fileType
  );

  // Only add the 'attributes' property for EVM
  if (attributesMetadata.length > 0) {
    initialMetadata.attributes = attributesMetadata;
  }

  if (fileType.startsWith("audio/")) {
    initialMetadata.image = await handleAudioFile();
  }

  return await uploadMetadata(fileIPFS, initialMetadata, () => {});
};

const getMetadataUrlStarknet = async ({
  fileType,
  fileIPFS,
  name,
  symbol,
  description,
}: MetadataProps) => {
  const initialMetadata = createInitialMetadata(
    name,
    symbol,
    description,
    fileIPFS,
    fileType
  );

  if (fileType.startsWith("audio/")) {
    initialMetadata.image = await handleAudioFile();
  }

  return await uploadMetadata(fileIPFS, initialMetadata, () => {});
};

const metadataURL = {
  getMetadataUrlStarknet,
  getMetadataUrlEVM,
};

export default metadataURL;
