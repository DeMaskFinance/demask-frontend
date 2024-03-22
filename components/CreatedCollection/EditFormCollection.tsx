import React, { useContext, useRef, useState } from "react";
import { Formik, Form, Field, useFormik, ErrorMessage } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { Button } from "../Buttons";
import Image from "next/image";
import images from "@/public/images";
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "../Icons";
import { Category } from "@/libs/constants";
import Icons from "@/public/icons/icon";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import AccountContext from "@/context/AccountContext";
import { collectionDetail } from "@/libs/service/collectionService";
const styles = {
  title: "block my-4 text-base font-semibold text-black24 flex gap-x-1",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-dark3 placeholder:text-sm hover:border-secondary3 focus:border-secondary3",
  btnActive: "rounded-full bg-base2",
};
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is a required").max(50),
  description: yup.string().required("Description is a required").max(200),
  URL: yup.string().url().nullable(),
  twitter: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/twitter.com\/).+$/, {
      message: "Invalid twitter url",
      excludeEmptyString: true,
    })
    .nullable(),
  facebook: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/facebook.com\/).+$/, {
      message: "Invalid facebook url",
      excludeEmptyString: true,
    })
    .nullable(),
  discord: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/discord.com\/).+$/, {
      message: "Invalid discord url",
      excludeEmptyString: true,
    })
    .nullable(),
  telegram: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/t.me\/).+$/, {
      message: "Invalid telegram url",
      excludeEmptyString: true,
    })
    .nullable(),
  website: yup.string().url().nullable(),
  Percent: yup
    .number()
    .min(0, "Must be greater than 0%")
    .max(10, "Must be less than 10%"),
});
const EditFormCollection = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [checkCollaborator, setCheckCollaborator] = useState<boolean>(false);
  const imgCollection = useRef(null);
  const { chainId } = useContext(AccountContext);
  const collectionAddress = useRouter().query.edit as string;

  const socialList = [
    {
      icon: <WebsiteIcon width={24} height={24} />,
      title: "Website",
      name: "website",
      placeHolder: "https://",
      value: 123,
    },
    {
      icon: <TwitterIcon width={24} height={24} />,
      title: "Twitter",
      name: "twitter",
      placeHolder: "https://twitter.com/",
      value: 612,
    },
    {
      icon: <FacebookIcon width={24} height={24} />,
      title: "Facebook",
      name: "facbook",
      placeHolder: "https://facebook.com/",
      value: 53342,
    },
    {
      icon: <TeleIcon width={24} height={24} className="fill-dark2" />,
      title: "Telegram",
      name: "telegram",
      placeHolder: "https://t.me/",
      value: 99123,
    },
    {
      icon: <DiscordIcon width={24} height={24} />,
      title: "Discord",
      name: "discord",
      placeHolder: "https://discord.com/",
      value: 321,
    },
    {
      icon: <GithubIcon width={24} height={24} />,
      title: "Github",
      name: "github",
      placeHolder: "https://github.com/",
      value: "12321",
    },
  ];
  const initialValues = {
    name: "qew",
    description: "123",
    URL: "",
    Collaborator: "",
    CreatorEarning: "",
    category: [] as string[],
    Percent: "",
    images: "",
    twitter: "",
    facebook: "",
    discord: "",
    telegram: "",
    website: "",
  };
  const selectCategory = (value: string, selectedCategory: string[], setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    console.log(value,selectedCategory);
    const isSelected = selectedCategory.includes(value);
    let updatedCategories;
    if (isSelected) {
      updatedCategories = selectedCategory.filter((item) => item !== value);
    } else {
      updatedCategories = [...selectedCategory, value];
    }
    setFieldValue("category",updatedCategories);
  };
  const onSubmit = async (values: any) => {
    // Handle form submission
    console.log(values);

    try {
      setLoading(true);
      console.log(values);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const listCollection = [
    {
      address: "0x4699A9A5607c9281103Ad504fA922276Eb6385A2",
      role: " Owner",
    },
  ];
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionDetail(collectionAddress, chainId);
        return res.data;
      }
    },
  });
  console.log(data);

  return (
    <div className="py-6 min-h-[75vh] max-w-[1440px] mx-auto mb-[100px] lg:mb-0">
      {/* <div className="h-[120px] lg:h-[240px]">
        <div className="w-full h-full bg-dark4 rounded-b-lg group-hover:brightness-[0.8]"></div>
      </div> */}
      <h1 className="mt-4 text-2xl font-semibold text-center">
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
          dirty,
          setFieldValue,
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
            <div>
              <p className={styles.title}>Category</p>
              <div className="flex">
                {Category.map((item, index) => (
                  <Field
                    type="button"
                    name="category"
                    id="category"
                    className={`px-3 py-1 mb-4 mr-4 text-sm h-[34px] text-dark2 border rounded-lg ${values.category.includes(item.value)&&'bg-dark3 text-white'}`}
                    key={item.id}
                    value={item.value}
                    onClick={() => selectCategory(item.value, values.category, setFieldValue)}
                  >
                  </Field>
                ))}
              </div>
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
                // value={values.images}
                onChange={(event) => {
                  if (
                    event.target.files &&
                    event.target.files[0].size < 10485760
                  ) {
                    const file = event.target.files[0];
                    setSelectedImage(file);
                    setFieldValue("images", file);
                  }
                }}
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
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                Collaborators
              </label>
              <p className="mb-4 text-dark2">
                Collaborators can only edit how this collection or drop appears
                on Demask
              </p>
              {listCollection.map((item, index) => (
                <div
                  className="flex items-center justify-between p-2 mb-2 font-semibold rounded-lg bg-dark5 text-dark2"
                  key={index}
                >
                  <p>{item.address}</p>
                  <p className="text-sm">{item.role}</p>
                </div>
              ))}

              {checkCollaborator ? (
                <div>
                  <div className="flex items-center">
                    <Field
                      type="text"
                      id="Collaborator"
                      name="Collaborator"
                      value={values.Collaborator}
                      placeholder="0x...123"
                      onChange={handleChange}
                      className={styles.inputItem}
                    />
                    <Image
                      src={Icons.deleteIcon}
                      alt="Delete property"
                      className="ml-2 cursor-pointer"
                      onClick={() => setCheckCollaborator(false)}
                    />
                  </div>
                  <ErrorMessage
                    name="Collaborator"
                    component="div"
                    className="mt-2 text-xs text-red"
                  />
                </div>
              ) : (
                <p
                  className="text-sm font-semibold cursor-pointer text-secondary2"
                  onClick={() => setCheckCollaborator(true)}
                >
                  + Add collaborator
                </p>
              )}
            </div>
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
                  id="CreatorEarning"
                  name="CreatorEarning"
                  value={values.CreatorEarning}
                  placeholder="0x...123"
                  onChange={handleChange}
                  className={styles.inputItem}
                />
                <div className="relative flex basis-16">
                  <Field
                    type="text"
                    id="Percent"
                    name="Percent"
                    value={values.Percent}
                    placeholder="0%"
                    onChange={handleChange}
                    className={`${styles.inputItem} `}
                  />
                  <p className="absolute right-2 top-[50%] -translate-y-[50%]">
                    %
                  </p>
                </div>
              </div>
              <ErrorMessage
                name="CreatorEarning"
                component="div"
                className="mt-2 text-xs text-red"
              />
              <ErrorMessage
                name="Percent"
                component="div"
                className="mt-2 text-xs text-red"
              />
            </div>
            <p className={styles.title}>Social link</p>
            {socialList.map((item, index) => (
              <div key={index}>
                <div className="flex mt-4 gap-x-4">
                  <div className="flex p-2 font-normal rounded-lg bg-dark4 min-w-[132px] gap-x-2 text-dark2">
                    {item.icon}
                    {item.title}
                  </div>
                  <Field
                    type="text"
                    value={(values as any)[item.name]}
                    id={item.name}
                    name={item.name}
                    placeholder={item.placeHolder}
                    className={styles.inputItem}
                  />
                </div>
                <ErrorMessage
                  name={item.name}
                  component="div"
                  className="mt-2 text-xs text-red"
                />
              </div>
            ))}
            <div className="flex justify-center mx-auto my-6 gap-x-6">
              <Link
                href="/profile"
                className="px-6 py-2 text-sm font-medium text-white rounded-lg bg-dark3"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                primary={dirty}
                active={!dirty}
                disabled={!dirty}
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
