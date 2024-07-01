import AccountContext from "@/context/AccountContext";
import { Category } from "@/libs/constants";
import { uploadFileIPFSCollection } from "@/libs/service/IPFSService";
import { SEO } from "@/next-seo.config";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import * as yup from "yup";
import * as collectionService from "@/libs/service/collectionService";
import { Button } from "../Buttons";
import WithAuth from "../Common/WithAuth";
import { LeftIcon, MonadIcon, SepoliaIcon } from "../Icons";
import { ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccessCreate } from "../Modal/ModalTransation/ModalSuccess";
import { UploadFileCollection } from "./UploadFile";
import ercContract from "@/libs/utils/erc/erc.contract";
import Back from "../Common/Back";
const updateMeta = {
  ...SEO,
  title: "Deploy Contract",
};

const validationSchema = yup.object().shape({
  contractName: yup.string().required("Contract name is a required").max(50),
  symbol: yup.string().required("Symbol is a required").max(10),
});
const DeployCollection = () => {
  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileType, setFileType] = useState<string | null>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [hash, setHash] = useState<string>("");
  const divRef = useRef<HTMLDivElement>(null);
  const { account, wallet, demask } = useContext(AccountContext);
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
      name: "Sepolia",
      icon: <SepoliaIcon width={20} height={20} />,
    },
  ];
  const initialValues = {
    avatar: "",
    contractName: "",
    category: [] as string[],
    symbol: "",
    chain: {
      name: "Monad",
      icon: <MonadIcon width={20} height={20} />,
    },
  };
  const selectCategory = (
    value: string,
    selectedCategory: string[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const isSelected = selectedCategory.includes(value);
    let updatedCategories;
    if (isSelected) {
      updatedCategories = selectedCategory.filter((item) => item !== value);
    } else {
      updatedCategories = [...selectedCategory, value];
    }
    setFieldValue("category", updatedCategories);
  };
  const onSubmit = async (values: any, { resetForm }: FormikHelpers<any>) => {
    try {
      setIsProcess(true);
      await collectionService.createCollection(fileIPFS.nonce, {
        category: values.category,
      });

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

  return (
    <>
      <NextSeo {...updateMeta} />
      <WithAuth>
        <div className="max-w-2xl gap-6 pt-6 mx-auto px-3">
          {/* UpLoad File */}
          <div className="">
            <div className="sticky top-16">
              <Back />
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
                <div>
                  <p className="title_label">Category</p>
                  <div className="flex">
                    {Category.map((item, index) => (
                      <div key={index}>
                        <Field
                          type="button"
                          name="category"
                          id="category"
                          className={`px-2 py-1 mb-4 mr-4 text-sm h-[34px] font-semibold text-white border-shader_500  border rounded-lg cursor-pointer ${
                            values.category.includes(item.value)
                              ? "bg-primary_500 "
                              : "bg-shader_700"
                          }`}
                          key={item.id}
                          value={item.value}
                          onClick={() =>
                            selectCategory(
                              item.value,
                              values.category,
                              setFieldValue
                            )
                          }
                        ></Field>
                      </div>
                    ))}
                  </div>
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
                          isOpenChain ? "block opacity-100" : "hidden opacity-0"
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
                    !isSubmitting &&
                    fileIPFS &&
                    isValid &&
                    selectedFile &&
                    values.category.length > 0
                  }
                  active={
                    isSubmitting ||
                    !fileIPFS ||
                    !isValid ||
                    !selectedFile ||
                    values.category.length === 0
                  }
                  disabled={
                    isSubmitting ||
                    !fileIPFS ||
                    !isValid ||
                    !selectedFile ||
                    values.category.length === 0
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
      </WithAuth>
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
          isMint={false}
          metadataLink={fileIPFS.url}
        />
      )}
    </>
  );
};

export default DeployCollection;
