import { uploadFileIPFSMint, uploadMetadataIPFS } from "../service/IPFSService";

interface MetadataProps {
  attributeItems: object[];
  fileType: any;
  fileIPFS: any;
  name: string;
  symbol: string;
  description: string;
}
const getMetadataUrl = async ({
  attributeItems,
  fileType,
  fileIPFS,
  name,
  symbol,
  description,
}: MetadataProps) => {
  const simplifiedAttributes = attributeItems.map(
    ({ trait_type, value }: any) => ({ trait_type, value })
  );
  const attributesMetadata = simplifiedAttributes.filter((attribute) => {
    return attribute.trait_type !== "" || attribute.value !== "";
  });
  const initialMetadata = {
    name: name,
    symbol: symbol,
    description: description,
    image: "",
    animation_url: "",
    attributes: attributesMetadata,
  };
  if (fileType.startsWith("video/")) {
    initialMetadata.animation_url = await fileIPFS; // use fileIPFS for animation_url
  } else if (fileType.startsWith("audio/")) {
    const imagePath = "/images/audio.svg";
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const file = new File([blob], "audio.svg", { type: "image/svg" });
    const audioImage = await uploadFileIPFSMint(file);
    initialMetadata.image = audioImage || "";
    initialMetadata.animation_url = await fileIPFS;
  } else {
    initialMetadata.image = await fileIPFS;
  }
  const urlMetadata = await uploadMetadataIPFS(initialMetadata);

  return urlMetadata;
};
export default getMetadataUrl;
