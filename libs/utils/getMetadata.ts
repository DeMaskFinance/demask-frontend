import { uploadFileToIPFS } from "./uploadFileIPFS";

interface MetadataProps {
  attributeItems: object[];
  fileType: any;
  fileIPFS: any;
  name: string;
  symbol: string;
  description: string;
  selectedCategory: string[];
}
const getMetadataUrl = async ({
  attributeItems,
  fileType,
  fileIPFS,
  name,
  symbol,
  description,
  selectedCategory,
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
    category: selectedCategory,
  };
  if (fileType.startsWith("video/")) {
    initialMetadata.animation_url = await fileIPFS; // Sử dụng fileIPFS cho thuộc tính animation_url
  } else if (fileType.startsWith("audio/")) {
    const imagePath = "/images/audio.svg";
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const file = new File([blob], "audio.svg", { type: "image/svg" });
    const audioImage = await uploadFileToIPFS(file);
    console.log(audioImage);
    initialMetadata.image = audioImage || "";
    initialMetadata.animation_url = await fileIPFS;
  } else {
    initialMetadata.image = await fileIPFS;
  }
  const metadata = JSON.stringify(initialMetadata);
  const urlMetadata = await uploadFileToIPFS(metadata);
  return urlMetadata;
};
export default getMetadataUrl;
