import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
import { queryClient } from "@/libs/constants";
import * as collectionService from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import * as yup from "yup";
import { ModalTransation } from "../ModalTransation";
interface ModalRoyaltyProps {
  data: any;
  onSuccess: () => void;
}
const ModalRoyalty: React.FunctionComponent<ModalRoyaltyProps> = ({
  data,
  onSuccess,
}) => {
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const { chainId, account, wallet } = useContext(AccountContext);
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);
  const initialValues = {
    creatorEarning: data.creatorAddress,
    royalty: data.royalty / 10000,
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
        data.dmlAddress,
        values.creatorEarning,
        values.royalty * 10000,
        chainId,
        blockTime
      );
      let trans;
      if (contracts) {
        trans = await ercContract.setRoyalty(
          "contracts.FEE_MANAGER_ADDRESS",
          data.dmlAddress,
          values.creatorEarning,
          values.royalty * 10000,
          blockTime,
          res.signature,
          account,
          wallet
        );
      }
      await trans.wait();
      setIsProcess(false);
      onSuccess();
      queryClient.refetchQueries({ queryKey: ["detailCollection"] });
      toast.success("Set Royalty Successed");
    } catch (error) {
      console.error(error);
      setIsProcess(false);
      onSuccess();
      toast.error("Set Royalty Error");
    }
  };
  return (
    <div className="relative rounded-lg h-fit">
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
              <p className="mb-4 text-shader_100">
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
                    autoComplete="off"
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
      <ModalTransation
        isOpenTransation={isProcess}
        setIsOpenTransaction={setIsProcess}
      />
    </div>
  );
};

export default ModalRoyalty;
