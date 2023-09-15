import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import React, { memo } from "react";
interface ModalDetailProps {
  nameNFT: string;
  symbolNFT: string;
  category: string[];
  attributes: string[];
  description: string;
  uri: string;
  setIsOpenDetail: any;
  isOpenDetail: boolean;
}

const ModalDetail: React.FunctionComponent<ModalDetailProps> = ({
  nameNFT,
  symbolNFT,
  category,
  attributes,
  description,
  uri,
  setIsOpenDetail,
  isOpenDetail,
}) => {
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenDetail(false);
  };
  const formattedDescription = description?.split("\n")?.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <Wrapper isOpen={isOpenDetail} onClick={handleClose}>
      <div className="flex items-center">
        <div className="z-50 flex flex-col justify-center max-h-[80vh] cursor-default">
          <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg px-4 pb-4 relative overflow-y-scroll">
            <p className="py-2 text-xl font-medium">Show Details</p>
            <ul>
              {nameNFT && (
                <li className="mb-4">
                  <p>NFT Name</p>
                  <a href={uri} rel="noreferrer noopener"
                    target="_blank" className="text-secondary5 ">{nameNFT}</a>
                </li>
              )}
              {symbolNFT && (
                <li className="mb-4">
                  <p>Symbol</p>
                  <p className="text-dark3">{symbolNFT}</p>
                </li>
              )}
              {description && (
                <li className="mb-4">
                  <p>Description</p>
                  <p className="text-dark3">{formattedDescription}</p>
                </li>
              )}
              {attributes && (
                <li className="mb-4">
                  <p>Attributes</p>
                  <div className="text-dark3">
                    {attributes.map((item: any, index) => (
                      <ul className="flex gap-x-4" key={index}>
                        <li>{item.trait_type}</li>
                        <li>{item.value}</li>
                      </ul>
                    ))}
                  </div>
                </li>
              )}
              {category && (
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
              )}
            </ul>

            <button
              className="absolute top-0 right-0 p-2 text-lg"
              onClick={handleClose}
            >
              <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default memo(ModalDetail);
