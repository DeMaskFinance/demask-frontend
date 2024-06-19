import { Button } from "@/components/Buttons";
import showToast, { ToastType } from "@/components/Toast/ToastCustom";
import AccountContext from "@/context/AccountContext";
import * as collectionService from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { CgClose } from "react-icons/cg";
import * as yup from "yup";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalRoyaltyProps {
  dmlAddress: string;
}
const ModalRoyalty: React.FunctionComponent<ModalRoyaltyProps> = ({
  dmlAddress,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const { chainId, demask, account, wallet } = useContext(AccountContext);

  const initialValues = {
    creatorEarning: "",
    royalty: "",
  };
  const validationSchema = yup.object().shape({
    creatorEarning: yup
      .string()
      .required("Creator Address is a required")
      .matches(
        /^(0x[a-fA-F0-9]{40}|[a-zA-Z0-9-]+\.eth)$/i,
        "Invalid address or ENS name"
      ),
    royalty: yup
      .number()
      .required()
      .min(0, "Royalty must be greater than 0%")
      .max(10, "Royalty must be less than 10%"),
  });
  const onSubmit = async (values: any) => {
    // Handle form submission
    try {
      const blockTime = Math.floor(Date.now() / 1000);
      setIsProcess(true);
      const res = await collectionService.getSignature(
        dmlAddress,
        values.creatorEarning,
        values.royalty,
        chainId,
        blockTime
      );

      const trans = await ercContract.setRoyalty(
        demask.FEE_MANAGER,
        dmlAddress,
        values.creatorEarning,
        values.royalty,
        blockTime,
        res.signature,
        account,
        wallet
      );
      const check = await trans.wait();
      setIsProcess(false);
      showToast("Set Royalty successed!", ToastType.Success);
    } catch (error) {
      console.error(error);
      setIsProcess(false);
    }
  };
  return (
    <div className="container_modal">
      <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
        <p className="py-2 text-xl title">Set Royalties</p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({
            values,
            handleChange,
            handleSubmit,
            isSubmitting,
            dirty,
            setFieldValue,
            isValid,
          }) => (
            <Form className="mx-auto max-w-[634px]">
              <div className="flex flex-col">
                <label htmlFor="name" className="title_label">
                  Creator earning
                </label>
                <p className="mb-4 text-shader_600">
                  Setting your earning Creator address.
                </p>
                <div className="flex gap-x-4">
                  <Field
                    type="text"
                    id="creatorEarning"
                    name="creatorEarning"
                    value={values.creatorEarning}
                    placeholder="0x...123"
                    onChange={handleChange}
                    className="input_item"
                  />
                  <div className="relative flex basis-16">
                    <Field
                      type="text"
                      id="royalty"
                      name="royalty"
                      value={values.royalty}
                      placeholder="0"
                      onChange={handleChange}
                      className="input_item"
                    />
                    <p className="absolute right-2 top-[50%] -translate-y-[50%]">
                      %
                    </p>
                  </div>
                </div>
                <ErrorMessage
                  name="creatorEarning"
                  component="div"
                  className="mt-1 text-xs text-red"
                />
                <ErrorMessage
                  name="royalty"
                  component="div"
                  className="mt-1 text-xs text-red"
                />
              </div>
              <Button
                type="submit"
                primary={dirty && !isSubmitting && isValid}
                active={!dirty || isSubmitting || !isValid}
                disabled={!dirty || isSubmitting || !isValid}
                className="px-6 py-2 mx-auto mt-4"
                isLoadingBtn={isSubmitting}
              >
                Set royalty
              </Button>
            </Form>
          )}
        </Formik>
      </div>

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isProcess}
        setIsOpenTransaction={setIsProcess}
        isTransaction={true}
      />
    </div>
  );
};

export default ModalRoyalty;
