import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import React, { memo } from "react";
interface ModalDetailProps {
  nameNFT: string;
  symbolNFT: string;
  category: string[];
  attributes: string[];
  description: string;
  setIsOpenDetail: any;
  isOpenDetail: boolean;
}

const ModalDetail: React.FunctionComponent<ModalDetailProps> = ({
  nameNFT,
  symbolNFT,
  category,
  attributes,
  description,
  setIsOpenDetail,
  isOpenDetail,
}) => {
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenDetail(false);
  };
  const formattedDescription = description.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  console.log(attributes);

  return (
    <Wrapper isOpen={isOpenDetail} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center h-full ">
        <div className="bg-white h-fit w-[432px] rounded-lg px-4 pb-4 relative overflow-y-scroll">
          <p className="py-2 text-xl font-medium">Show Details</p>
          <ul>
            <li className="mb-4">
              <p>NFT Name</p>
              <p className="text-dark3">{nameNFT}</p>
            </li>
            <li className="mb-4">
              <p>Symbol</p>
              <p className="text-dark3">{symbolNFT}</p>
            </li>
            <li className="mb-4">
              <p>Description</p>
              <p className="text-dark3">{formattedDescription}</p>
            </li>
            <li className="mb-4">
              <p>Attributes</p>
              <div className="text-dark3">
                {attributes.map((item:any, index) => (
                  <ul className="flex gap-x-4" key={index}>
                    <li>{item.trait_type}</li>
                    <li>{item.value}</li>
                  </ul>
                ))}
              </div>
            </li>
            <li>
              <p>Category</p>
              <div className="flex gap-x-4">
                {category.map((item, index) => (
                  <p className="text-dark3" key={index}>
                    {item}
                  </p>
                ))}
              </div>
            </li>
          </ul>

          <button
            className="absolute top-0 right-0 p-2 text-lg"
            onClick={handleClose}
          >
            <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default memo(ModalDetail);
