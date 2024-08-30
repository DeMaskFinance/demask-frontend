import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { collectionListUser } from "@/libs/service/collectionService";
import AccountContext from "@/context/AccountContext";
import { PlusIcon } from "../Icons";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { Button } from "../Buttons";
import getMetadataUrl from "@/libs/utils/getMetadata";
import useContractWrite from "@/hooks/useContractWrite";
import { starknetContract } from "@/libs/utils/starknet/contract";
import { ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccessCreate } from "../Modal/ModalTransation/ModalSuccess";
import { toast } from "sonner";
export interface MintNFTStarknetProps {
  fileIPFS: string;
  setFileIPFS: any;
  setSelectedFile: any;
  fileType: string;
  data: CollectionProps[];
}
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is a required").max(50),
  symbol: yup.string().required("Symbol is a required").max(50),
  description: yup.string().max(1000).nullable(),
});
const initialValues = {
  name: "",
  symbol: "",
  description: "",
};
const MintNFTStarknet: React.FC<MintNFTStarknetProps> = ({
  data,
  fileIPFS,
  setFileIPFS,
  setSelectedFile,
  fileType,
}) => {
  const { account, chainId, wallet } = useContext(AccountContext);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [metadataIPFS, setMetadataIPFS] = useState<string>("");
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const [collection, setCollection] = useState<CollectionProps>(data[0]);
  const handleSelectChange = (index: string) => {
    setCollection(data[parseInt(index, 10)]);
  };
  const { writeAsync, isPending } = useContractWrite(
    wallet,
    collection.collectionAddress,
    "safeMint"
  );

  const isExistId = async (idNFT: number) => {
    const contract = await starknetContract.getContract(
      collection.collectionAddress
    );
    const res = await contract.exists_id(idNFT);
    return res;
  };
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };
  const onSubmit = async (values: any, { resetForm }: FormikHelpers<any>) => {
    if (!fileIPFS) {
      toast.error("File not found.Try again!");
      return;
    }
    let randomId: number;
    let exists: boolean;
    setIsProcess(true);
    do {
      randomId = generateRandomId();
      exists = await isExistId(randomId);
    } while (exists);
    const urlMetadata = await getMetadataUrl.getMetadataUrlStarknet({
      fileType,
      fileIPFS,
      name: values.name,
      symbol: values.symbol,
      description: values.description,
    });
    setMetadataIPFS(urlMetadata);
    const receipt = await writeAsync([account, randomId, urlMetadata]);
    setHash(receipt!.transaction_hash);

    if (receipt?.statusReceipt === "success") {
      setIsOpenSuccess(true);
    }
    resetForm();
    setSelectedFile(null);
    setFileIPFS(null);
    setIsProcess(false);
  };
  return (
    <div>
      <label htmlFor="collection" className="block mb-4 font-semibold">
        <span className="">Collection</span>
        <span className="text-primary_400">*</span>
      </label>
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="relative flex items-center pr-3 cursor-pointer input_item h-12 w-full">
          <div className="flex items-center gap-x-2">
            <img
              src={formatLinkIPFS(collection.url)}
              alt="list_collection"
              className="object-cover w-8 h-8 rounded-lg"
            />
            <SelectValue placeholder={collection.name}>
              {collection.name}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg_main">
          <SelectGroup>
            <Link
              href={`/create/deploy-contract`}
              className="flex items-center p-2 cursor-pointer gap-x-2 hover:bg-shader_500"
            >
              <div className="flex font-semibold gap-x-[10px] items-center text-white">
                <div className=" bg-primary_500 bg-opacity-[0.15] w-10 h-10 rounded-lg text-center text-2xl text-primary_400 flex items-center justify-center">
                  <PlusIcon />
                </div>
                Create Collection
              </div>
            </Link>
            {data.map((item: CollectionProps, index: number) => (
              <SelectItem
                key={index}
                value={index.toString()}
                className="p-0 block"
              >
                <div className="flex items-center cursor-pointer gap-x-2 hover:bg-shader_500 w-full p-2 text-white">
                  <img
                    src={formatLinkIPFS(item.url)}
                    alt="list_collection"
                    className="object-cover w-8 h-8 rounded-lg"
                  />
                  <p className="font-semibold">{item.name}</p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, handleChange, isSubmitting, dirty, isValid }) => {
          return (
            <Form className="font-semibold">
              <div className="flex flex-col">
                <label htmlFor="name" className="title_label mt-5">
                  Name
                  <p className="text-primary_400">*</p>
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="Name"
                  className="input_item"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs text-red"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="symbol" className={`title_label`}>
                  <div className="flex">Symbol</div>
                  <p className="text-primary_400">*</p>
                </label>
                <Field
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={values.symbol}
                  autoComplete="off"
                  placeholder="Symbol"
                  className="input_item"
                />
                <ErrorMessage
                  name="symbol"
                  component="div"
                  className="text-xs text-red"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className={`title_label`}>
                  <div className="flex">Description</div>
                </label>
                <Field
                  as="textarea"
                  type="text"
                  id="description"
                  name="description"
                  value={values.description}
                  autoComplete="off"
                  placeholder="Description"
                  className="input_item min-h-[3lh]"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-xs text-red"
                />
              </div>
              <Button
                type="submit"
                primary={dirty && !isSubmitting}
                active={!dirty || isSubmitting || !isValid}
                disabled={!dirty || isSubmitting || !isValid}
                className="px-6 py-2 cursor-pointer mt-4"
                isLoadingBtn={isSubmitting}
              >
                Create NFT
              </Button>
            </Form>
          );
        }}
      </Formik>
      <ModalTransation
        isOpenTransation={isProcess}
        setIsOpenTransaction={setIsProcess}
      />
      {isOpenSuccess && (
        <ModalSuccessCreate
          isOpenSuccess={isOpenSuccess}
          type=""
          setIsOpenSuccess={setIsOpenSuccess}
          transactionHash={hash}
          isMint
          metadataLink={metadataIPFS}
        />
      )}
    </div>
  );
};

export default MintNFTStarknet;
