import React, { useRef, useState } from "react";
import { Formik, Form, Field, useFormik, ErrorMessage } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { Button } from "../Buttons";
import Image from "next/image";
import images from "@/public/images";
const styles = {
  title: "block my-4 text-base font-semibold text-black24 flex gap-x-1",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-dark3 placeholder:text-sm hover:border-secondary3 focus:border-secondary3",
  btnActive: "rounded-full bg-base2",
};
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is a required").max(50),
  description: yup.string().required("Description is a required").max(200),
  URL: yup.string().max(200).nullable(),
});
const EditFormCollection = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const imgCollection = useRef(null);
  const initialValues = {
    name: "qew",
    description: "123",
    URL: "",
    images: "",
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0].size < 10485760) {
      const file = event.target.files[0];
      setSelectedImage(file);
    }
  };
  const onSubmit = async (values: any) => {
    // Handle form submission
    try {
      setLoading(true);
      console.log(values);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-8 min-h-[75vh] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto  mb-14 lg:mb-0">
      <h1 className="text-2xl font-semibold text-center">
        Edit Collection Details
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form className="mx-auto max-w-[600px]">
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                Name
                <p className="text-red">*</p>
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Unnamed"
                className={styles.inputItem}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-2 text-xs text-red"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className={styles.title}>
                Description
                <p className="text-red">*</p>
              </label>
              <Field
                as="textarea"
                type="text"
                id="description"
                name="description"
                value={values.description}
                placeholder="Add a description"
                className={styles.inputItem}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-2 text-xs text-red"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                URL
              </label>
              <p className="mb-4 text-dark2">
                Customize your URL on Demask. Must only contain lowercase
                letters, numbers, and hyphens.
              </p>
              <Field
                type="text"
                id="URL"
                name="URL"
                value={values.URL}
                placeholder="https://Demask.finance/collection/abcdef"
                onChange={handleChange}
                className={styles.inputItem}
              />
              <ErrorMessage
                name="URL"
                component="div"
                className="mt-2 text-xs text-red"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                Featured image
              </label>
              <p className="mb-4 text-dark2">
                This image will be used for featuring your collection on the
                homepage, category pages, or other display areas of Demask
              </p>
              <input
                type="file"
                id="images"
                name="images"
                value={values.images}
                onChange={handleImageChange}
                ref={imgCollection}
                className="hidden"
                accept="image/png,image/jpeg,image/gif"
              />
              <div>
                <div
                  onClick={() => {
                    if (imgCollection.current) {
                      (imgCollection.current as HTMLInputElement).click();
                    }
                  }}
                  className="flex flex-col items-center justify-center py-6 border rounded-lg cursor-pointer border-dark4"
                >
                  {selectedImage ? (
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="selected image"
                      width={360}
                      height={360}
                      className="object-cover w-[160px] rounded-lg mx-auto h-[160px] mb-4"
                    />
                  ) : (
                    <Image
                      src={images.pictureFrame}
                      alt="pictureframe"
                      width={360}
                      height={360}
                      className="object-cover w-[120px] rounded-[2rem] mx-auto"
                    />
                  )}
                  <div className="text-sm text-dark3 ">
                    <span>Recommended size: 500 x 500</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mx-auto my-6 gap-x-6">
              <Link
                href="/profile"
                className="px-6 py-2 text-sm font-medium text-white rounded-lg bg-dark3"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                primary
                className="px-6 py-2"
                isLoadingBtn={loading}
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditFormCollection;
