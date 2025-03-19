import AccountContext from "@/context/AccountContext";
import { Category, queryClient, starknet } from "@/libs/constants";
import * as collectionService from "@/libs/service/collectionService";
import { uploadFileIPFSCollection } from "@/libs/service/IPFSService";
import ercContract from "@/libs/utils/erc/erc.contract";
import { deployContract } from "@/libs/utils/starknet/deployContract";
import { SEO } from "@/next-seo.config";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { NextSeo } from "next-seo";
import { useContext, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import * as yup from "yup";
import { Button } from "../Buttons";
import Back from "../Common/Back";
import WithAuth from "../Common/WithAuth";
import { ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccessCreate } from "../Modal/ModalTransation/ModalSuccess";
import { UploadFileCollection } from "./UploadFile";
import { starknetContract } from "@/libs/utils/starknet/contract";
import { RpcProvider, WalletAccount } from "starknet";
const updateMeta = {
  ...SEO,
  title: "Deploy Contract",
};
const validationSchema = yup.object().shape({
  contractName: yup.string().required("Contract name is a required").max(50),
  symbol: yup.string().required("Symbol is a required").max(10),
  description: yup.string().max(1000).nullable(),
});
const DeployCollection = () => {
  const [fileIPFS, setFileIPFS] = useState<any>();
  const [fileType, setFileType] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [hash, setHash] = useState<string>("");
  const { account, wallet, chainId } = useContext(AccountContext);
  const [version] = useQueryParam("version", withDefault(StringParam, "v2"));
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);

  const initialValues = {
    avatar: "",
    contractName: "",
    category: [] as string[],
    symbol: "",
    description: "",
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
  const handleEVMTransaction = async (values: any) => {
    if (!contracts) return null;

    const res = await ercContract.fillCreate(
      values.contractName,
      values.symbol,
      fileIPFS.nonce,
      contracts.CREATED_COLLECTION_ADDRESS,
      account,
      wallet
    );

    setHash(res.hash);
    await res.wait();

    return res;
  };
  const handleStarknetTransaction = async (values: InitialValues) => {
    const res = await deployContract.deployContractCollection(
      account,
      wallet,
      values,
      fileIPFS.nonce,
      String(contracts?.CREATED_COLLECTION_CLASSHASH)
    );
    if (res) {
      // @ts-ignore
      setHash(res.value.transaction_hash);
    }

    return res;
  };
  const checkTransactionStatus = async (res: any) => {
    if (!res) return;

    const status =
      chainId !== starknet.StarknetChainId.SN_SEPOLIA
        ? (await res.wait()).status
        : res.value.execution_status;

    setIsOpenSuccess(status === "SUCCEEDED" || status === 1);
  };
  const testBravos = async () => {
    console.log(wallet, 123);

    // const swo = window.starknet_braavos;
    // console.log("swo", swo);
    // const myProvider = new RpcProvider({
    //   nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
    // });
    // const wa = new WalletAccount(myProvider, swo);
    // console.log("wa", wa);
    // console.log(await wa.getChainId());

    // const res = await starknetContract.getWalletAccount(wallet);
    // const res1 = await deployContract.deployContractCollection(
    //   account,
    //   wallet,
    //   [{}],
    //   123
    // );
    // console.log({
    //   res,
    //   res1,
    // });
  };

  const onSubmit = async (
    values: InitialValues,
    { resetForm }: FormikHelpers<any>
  ) => {
    try {
      setIsProcess(true);
      await collectionService.createCollection(fileIPFS.nonce, {
        category: values.category,
        description: values.description,
      });
      let res;
      if (chainId !== starknet.StarknetChainId.SN_SEPOLIA) {
        res = await handleEVMTransaction(values);
      } else {
        res = await handleStarknetTransaction(values);
      }
      await checkTransactionStatus(res);
      setIsProcess(false);
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
        <div className="max-w-2xl gap-6 px-3 mx-auto">
          {/* UpLoad File */}
          <div className="">
            <div className="sticky top-16">
              <Back />
              <h2 className="text-xl font-bold text-primary_300">
                Create an Collection
              </h2>
              <h3 className="my-2 text-sm font-normal text-shader_200">
                Deploy an{" "}
                {chainId === starknet.StarknetChainId.SN_SEPOLIA
                  ? "ERC-721"
                  : "ERC-1155"}{" "}
                contract to create your NFT collection
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
              You’ll need to deploy an{" "}
              {chainId === starknet.StarknetChainId.SN_SEPOLIA
                ? "ERC-721"
                : "ERC-1155"}{" "}
              contract onto the Blockchain before you can create a Collection
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
                    autoComplete="off"
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
                          className={`px-2 py-1 mb-4 mr-4 text-sm h-[34px] font-semibold text-white border-shader_500  border rounded-lg cursor-pointer ${values.category.includes(item.value)
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
                  <div className="flex flex-col w-full">
                    <label htmlFor="symbol" className="title_label">
                      Symbol
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
                      className="mt-1 text-xs text-red"
                    />
                  </div>
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
                  className="w-full py-3 mt-4"
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
