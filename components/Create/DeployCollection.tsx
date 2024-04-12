import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState } from "react";
import WithAuth from "../Common/WithAuth";
import { SEO } from "@/next-seo.config";
import { BackIcon, CreateIcon, DeployIcon, MonadIcon } from "../Icons";
import UploadFile from "./UploadFile";
import * as yup from "yup";
import { Button } from "../Buttons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
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
  const initialValues = {
    contractName: "",
    symbol: "",
  };
  const onSubmit = async (values: any) => {
    // Handle form submission
    try {
    } catch (error) {
      console.error(error);
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
                      onChange={handleChange}
                      placeholder="Input contract name"
                      className={styles.inputItem}
                    />
                    <ErrorMessage
                      name="contractName"
                      component="div"
                      className="mt-2 text-xs text-red"
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
                      className={styles.inputItem}
                    />
                    <ErrorMessage
                      name="symbol"
                      component="div"
                      className="mt-2 text-xs text-red"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="name" className={styles.title}>
                      Chain
                      <p className="text-red">*</p>
                    </label>
                    <Field
                      as="select"
                      name="color"
                      className={styles.inputItem}
                    >
                      <option value="Monad" className={styles.inputItem}>
                        {/* <MonadIcon
                          width={20}
                          height={20}
                          className="fill-dark1"
                        /> */}
                        <p>Monad</p>
                      </option>
                    </Field>
                  </div>
                  <label htmlFor="name" className={styles.title}>
                    Initialization
                  </label>
                  <Button
                    type="submit"
                    primary={dirty && !isSubmitting}
                    active={!dirty || isSubmitting}
                    disabled={!dirty || isSubmitting}
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
    </>
  );
};

export default DeployCollection;
