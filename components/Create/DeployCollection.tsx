import AccountContext from "@/context/AccountContext";
import { uploadFileIPFSCollection } from "@/libs/service/IPFSService";
import ercContract from "@/libs/utils/erc/erc.contract";
import { SEO } from "@/next-seo.config";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import * as yup from "yup";
import { Button } from "../Buttons";
import WithAuth from "../Common/WithAuth";
import {
  BlastIcon,
  DeployIcon,
  LeftIcon,
  MonadIcon,
  SepoliaIcon,
} from "../Icons";
import { ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccessCreate } from "../Modal/ModalTransation/ModalSuccess";
import { UploadFileCollection } from "./UploadFile";
const updateMeta = {
  ...SEO,
  title: "Deploy Contract",
};
const styles = {
  title: "block my-5 text-base font-semibold text-shader_100 flex gap-x-1",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-shader_500 placeholder:text-sm hover:border-primary_400 focus:border-primary_400 dark:bg-shader_700 dark:border-shader_700",
  btnActive: "rounded-full bg-base2",
};
const validationSchema = yup.object().shape({
  contractName: yup.string().required("Contract name is a required").max(50),
  symbol: yup.string().required("Symbol is a required").max(10),
});
const DeployCollection = () => {
  const router = useRouter();
  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileType, setFileType] = useState<string | null>("");
  const { account, wallet, demask } = useContext(AccountContext);
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [hash, setHash] = useState<string>("");
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsOpenChain(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const [isOpenChain, setIsOpenChain] = useState<boolean>(false);
  const chainList = [
    {
      name: "Monad",
      icon: <MonadIcon width={20} height={20} />,
    },
    {
      name: "Blast",
      icon: <SepoliaIcon width={20} height={20} />,
    },
  ];
  const initialValues = {
    avatar: "",
    contractName: "",
    symbol: "",
    chain: {
      name: "Monad",
      icon: <MonadIcon width={20} height={20} />,
    },
  };

  const onSubmit = async (values: any, { resetForm }: FormikHelpers<any>) => {
    // Handle form submission
    try {
      setIsProcess(true);
      const res = await ercContract.fillCreate(
        values.contractName,
        values.symbol,
        fileIPFS.nonce,
        demask.CREATE_COLLECTION,
        account,
        wallet
      );
      setHash(res.hash);
      const check = await res.wait();
      setIsProcess(false);
      if (check.status === 1) {
        setIsOpenSuccess(true);
      } else {
        setIsOpenSuccess(false);
      }
      resetForm();
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      setIsProcess(false);
      resetForm();
    }
  };
  console.log(selectedFile, fileIPFS);

  return (
    <>
      <NextSeo {...updateMeta} />
      <WithAuth>
        <div className="max-w-2xl gap-6 pt-6 mx-auto lg:pb-8">
          {/* UpLoad File */}
          <div className="">
            <div className="sticky top-16">
              <div
                className="flex items-center cursor-pointer gap-x-2"
                onClick={() => router.back()}
              >
                <LeftIcon width={20} height={20} />

                <p className="font-semibold text-white">Back</p>
              </div>
              <h2 className="mt-4 text-xl font-bold text-primary_300">
                Create an Collection
              </h2>
              <h3 className="my-2 text-sm font-normal text-shader_200">
                Deploy an ERC-1155 contract to create your NFT collection
              </h3>
              <p className="mt-2 mb-4 text-xs text-primary_400">
                * Required fields
              </p>
            </div>
          </div>
          <div className="p-3 mb-5 rounded-lg bg-primary_500 bg-opacity-10">
            <h3 className="font-bold text-white">
              🚨 You’ll need to deploy a contract
            </h3>
            <h4 className="mt-1 text-sm text-white">
              You’ll need to deploy an ERC-1155 contract onto the Blockchain
              before you can create a Collection
            </h4>
          </div>

          <div className="">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({
                values,
                handleChange,
                isSubmitting,
                dirty,
                setFieldValue,
                isValid,
              }) => (
                <Form className="">
                  <UploadFileCollection
                    setFileIPFS={setFileIPFS}
                    setFileType={setFileType}
                    fileType={fileType}
                    uploadFile={uploadFileIPFSCollection}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    setFieldValue={setFieldValue}
                    values={values}
                  />
                  <div className="flex flex-col">
                    <label htmlFor="contractName" className="title_label">
                      Contract Name
                      <p className="text-primary_400">*</p>
                    </label>
                    <Field
                      type="text"
                      id="contractName"
                      name="contractName"
                      value={values.contractName}
                      placeholder="Input contract name"
                      className="input_item"
                      autocomplete="off"
                      onChange={(e: any) => {
                        handleChange(e);
                        const firstLetter = e.target.value.charAt(0);
                        handleChange({
                          target: {
                            name: "symbol",
                            value: firstLetter.toUpperCase(),
                          },
                        });
                      }}
                    />
                    <ErrorMessage
                      name="contractName"
                      component="div"
                      className="mt-1 text-xs text-red"
                    />
                  </div>
                  <div className="flex mb-5 gap-x-4">
                    <div className="flex flex-col basis-1/2">
                      <label htmlFor="symbol" className="title_label">
                        Symbol
                        <p className="text-primary_400">*</p>
                      </label>
                      <Field
                        type="text"
                        id="symbol"
                        name="symbol"
                        value={values.symbol}
                        autocomplete="off"
                        placeholder="Symbol"
                        className="input_item"
                      />
                      <ErrorMessage
                        name="symbol"
                        component="div"
                        className="mt-1 text-xs text-red"
                      />
                    </div>
                    <div className="flex flex-col basis-1/2">
                      <label htmlFor="name" className="title_label">
                        Chain
                        <p className="text-primary_400">*</p>
                      </label>
                      <div
                        ref={divRef}
                        className="relative flex items-center justify-between pr-3 cursor-pointer input_item"
                        onClick={() => setIsOpenChain(!isOpenChain)}
                      >
                        <div className="flex items-center gap-x-2">
                          {values.chain.icon}
                          <p>{values.chain.name}</p>
                        </div>
                        <FaAngleDown
                          className={`text-white transition-all duration-150 ${
                            isOpenChain ? "rotate-180" : "rotate-0"
                          }`}
                        />
                        <ul
                          className={` rounded-lg absolute w-full left-0 top-12  transition-all duration-500 max-h-40 overflow-y-scroll bg-shader_700 border-shader_700 ${
                            isOpenChain
                              ? "block opacity-100"
                              : "hidden opacity-0"
                          }`}
                        >
                          {chainList.map((item, index) => (
                            <li
                              className="flex items-center p-3 cursor-pointer gap-x-2 hover:bg-shader_500 "
                              onClick={() => setFieldValue("chain", item)}
                              key={index}
                            >
                              {item.icon}
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    primary={
                      !isSubmitting && fileIPFS && isValid && selectedFile
                    }
                    active={
                      isSubmitting || !fileIPFS || !isValid || !selectedFile
                    }
                    disabled={
                      isSubmitting || !fileIPFS || !isValid || !selectedFile
                    }
                    className="w-full py-3"
                    isLoadingBtn={isSubmitting}
                  >
                    Create
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </WithAuth>
      <ModalTransation
        isOpenTransation={isProcess}
        setIsOpenTransaction={setIsProcess}
        isTransaction={true}
      />
      {isOpenSuccess && (
        <ModalSuccessCreate
          isOpenSuccess={isOpenSuccess}
          type=""
          setIsOpenSuccess={setIsOpenSuccess}
          transactionHash={hash}
          isMint={false}
          metadataLink={fileIPFS.url}
        />
      )}
    </>
  );
};

export default DeployCollection;
