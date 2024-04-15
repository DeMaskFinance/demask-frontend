import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import WithAuth from "../Common/WithAuth";
import { SEO } from "@/next-seo.config";
import {
  BackIcon,
  BlastIcon,
  CreateIcon,
  DeployIcon,
  MonadIcon,
} from "../Icons";
import UploadFile from "./UploadFile";
import * as yup from "yup";
import { Button } from "../Buttons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";
import ercContract from "@/libs/utils/erc/erc.contract";
import AccountContext from "@/context/AccountContext";
import { ModalSuccess, ModalTransation } from "../Modal/ModalTransation";
const updateMeta = {
  ...SEO,
  title: "Deploy Contract",
};
const styles = {
  title: "block my-4 text-base font-semibold text-black24 flex gap-x-1",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-dark3 placeholder:text-sm hover:border-secondary3 focus:border-secondary3 dark:bg-darkBG2 dark:border-darkBG2",
  btnActive: "rounded-full bg-base2",
};
const validationSchema = yup.object().shape({
  contractName: yup.string().required("Name is a required").max(50),
  symbol: yup.string().required("Symbol is a required").max(10),
});
const DeployCollection = () => {
  const router = useRouter();
  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const { account, wallet, demask } = useContext(AccountContext);
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
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
      icon: <MonadIcon className="fill-dark2 " width={20} height={20} />,
    },
    {
      name: "Blast",
      icon: <BlastIcon className="fill-dark2 " width={20} height={20} />,
    },
  ];
  const initialValues = {
    contractName: "",
    symbol: "",
    chain: {
      name: "Monad",
      icon: <MonadIcon className="fill-dark2 " width={20} height={20} />,
    },
  };
  const onSubmit = async (values: any) => {
    // Handle form submission
    console.log(values, fileIPFS);
    setIsProcess(true);
    const res = await ercContract.fillCreate(
      values.contractName,
      values.symbol,
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
    try {
    } catch (error) {
      console.error(error);
      setIsProcess(false);
    }
  };
  return (
    <>
      <NextSeo {...updateMeta} />
      <WithAuth>
        <div className="flex flex-col gap-6 px-4 py-8 pb-24 mx-auto lg:px-0 lg:flex-row md:flex-row container-main lg:pb-8">
          {/* UpLoad File */}
          <div className="w-full lg:w-2/4 md:w-2/4 shrink-0">
            <div className="sticky top-16">
              <div className="flex items-center gap-x-2">
                <div onClick={() => router.back()}>
                  <BackIcon width={20} height={20} />
                </div>
                <h2 className="flex items-center text-2xl font-semibold text_gradient gap-x-1">
                  <DeployIcon width={22} height={22} />
                  Create An Collection
                </h2>
              </div>
              <h3 className="my-2 font-normal text-dark2">
                Deploy an ERC-1155 contract to create your NFT collection
              </h3>
              <p className="mt-2 mb-6 text-xs text-red">* Required fields</p>
              <UploadFile setFileIPFS={setFileIPFS} />
            </div>
          </div>
          <div className="w-full lg:w-2/4 md:w-2/4">
            <h4 className="text-xl font-semibold lg:text-2xl title">
              You’ll need to deploy a contract
            </h4>
            <h3 className="mt-2 font-normal text-dark2">
              You’ll need to deploy an ERC-721 or an ERC-1155 contract onto the
              Blockchain before you can create a Collection
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                dirty,
                setFieldValue,
              }) => (
                <Form className="mx-auto max-w-[600px]">
                  <div className="flex flex-col">
                    <label htmlFor="contractName" className={styles.title}>
                      Contract Name
                      <p className="text-red">*</p>
                    </label>
                    <Field
                      type="text"
                      id="contractName"
                      name="contractName"
                      value={values.contractName}
                      placeholder="Input contract name"
                      className="input_item"
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
                      className="text-xs text-red"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="symbol" className={styles.title}>
                      Symbol
                      <p className="text-red">*</p>
                    </label>
                    <Field
                      as="textarea"
                      type="text"
                      id="symbol"
                      name="symbol"
                      value={values.symbol}
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
                    <label htmlFor="name" className={styles.title}>
                      Chain
                      <p className="text-red">*</p>
                    </label>
                    <div
                      ref={divRef}
                      className="relative flex items-center justify-between pr-3 input_item"
                      onClick={() => setIsOpenChain(!isOpenChain)}
                    >
                      <div className="flex items-center gap-x-2">
                        {values.chain.icon}
                        <p>{values.chain.name}</p>
                      </div>
                      <FaAngleDown
                        className={`text-dark2 transition-all duration-150 ${
                          isOpenChain ? "rotate-180" : "rotate-0"
                        }`}
                      />
                      <ul
                        className={`p-3 rounded-lg absolute w-full left-0 top-12  bg-dark5 transition-all duration-500 max-h-40 overflow-y-scroll area_input ${
                          isOpenChain ? "block opacity-100" : "hidden opacity-0"
                        }`}
                      >
                        {chainList.map((item, index) => (
                          <li
                            className="flex items-center p-2 rounded-lg cursor-pointer gap-x-2 hover:bg-dark4 area_input_hover"
                            onClick={() => setFieldValue("chain", item)}
                          >
                            {item.icon}
                            {item.name}
                          </li>
                        ))}
                        <li></li>
                      </ul>
                    </div>
                  </div>
                  <label htmlFor="name" className={styles.title}>
                    Initialization
                  </label>
                  <Button
                    type="submit"
                    primary={!isSubmitting && fileIPFS}
                    active={isSubmitting || !fileIPFS}
                    disabled={isSubmitting || !fileIPFS}
                    className="px-6 py-2"
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
        <ModalSuccess
          isOpenSuccess={isOpenSuccess}
          type=""
          setIsOpenSuccess={setIsOpenSuccess}
          transactionHash={hash}
          isMint
          metadataLink={fileIPFS}
        />
      )}
    </>
  );
};

export default DeployCollection;
