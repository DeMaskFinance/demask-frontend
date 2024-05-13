import React, { useContext, useState } from "react";
import Wrapper from "../Wrapper";
import { ModalWallet } from "../ModalWallet";
import { CgClose } from "react-icons/cg";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as collectionService from "@/libs/service/collectionService";
import { useRouter } from "next/router";
import AccountContext from "@/context/AccountContext";
const styles = {
  title: "block my-4 text-base font-semibold text-black24 flex gap-x-1",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-dark3 placeholder:text-sm hover:border-secondary3 focus:border-secondary3 dark:bg-darkBG2 dark:border-darkBG2",
  btnActive: "rounded-full bg-base2",
};
interface ModalRoyaltyProps {
  isOpenRoyalty: boolean;
  setIsOpenRoyalty: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalRoyalty: React.FunctionComponent<ModalRoyaltyProps> = ({
  isOpenRoyalty,
  setIsOpenRoyalty,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const collectionAddress = useRouter().query.edit as string;
  const { chainId } = useContext(AccountContext);
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenRoyalty(false);
  };
  const initialValues = {
    creatorEarning: "",
    royalty: "",
  };
  const validationSchema = yup.object().shape({
    royalty: yup
      .number()
      .min(0, "Royalty must be greater than 0%")
      .max(10, "Royalty must be less than 10%"),
  });
  const onSubmit = async (values: any) => {
    // Handle form submission
    try {
      await collectionService.updateCollection(
        {
          creatorEarning: values.creatorEarning,
          royalty: values.royalty,
        },
        collectionAddress,
        chainId
      );
      toast.success("Update successed!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Wrapper isOpen={isOpenRoyalty} onClick={handleClose}>
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
            }) => (
              <Form className="mx-auto max-w-[600px]">
                <div className="flex flex-col">
                  <label htmlFor="name" className={styles.title}>
                    Creator earning
                  </label>
                  <p className="mb-4 text-dark2">
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
                    className="text-xs text-red"
                  />
                  <ErrorMessage
                    name="royalty"
                    component="div"
                    className="text-xs text-red"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </Wrapper>
  );
};

export default ModalRoyalty;
