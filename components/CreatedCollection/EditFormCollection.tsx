import AccountContext from "@/context/AccountContext";
import { Category } from "@/libs/constants";
import * as collectionService from "@/libs/service/collectionService";
import images from "@/public/images";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Button } from "../Buttons";
import { FacebookIcon, TeleIcon, TwitterIcon, WebsiteIcon } from "../Icons";

const styles = {
  title: "block my-4 text-base font-semibold text-black24 flex gap-x-1",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-shader_500 placeholder:text-sm hover:border-primary_400 focus:border-primary_400 dark:bg-shader_700 dark:border-shader_700",
  btnActive: "rounded-full bg-base2",
};

interface EditCollectionProps {
  data: any;
  refetch: any;
}
const EditFormCollection: React.FC<EditCollectionProps> = ({
  data,
  refetch,
}) => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [checkCollaborator, setCheckCollaborator] = useState<boolean>(false);
  const imgCollection = useRef(null);
  const { account, chainId } = useContext(AccountContext);
  const router = useRouter();
  const collectionAddress = useRouter().query.edit as string;
  const typeERC = useRouter().query.type;
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is a required").max(50),
    description: yup.string().required("Description is a required").max(200),
    url: yup.string().url().nullable(),
    collaborator: yup
      .string()
      .matches(
        /^(0x[a-fA-F0-9]{40}|[a-zA-Z0-9-]+\.eth)$/i,
        "Invalid address or ENS name"
      )
      .min(42)
      .test(
        "unique-collaborator",
        "You're already an authorized editor",
        (value) => {
          if (value) {
            return !data?.collaborators.includes(value.toLowerCase());
          } else {
            return true;
          }
        }
      )
      .nullable(),
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
    royalty: yup
      .number()
      .min(0, "Royalty must be greater than 0%")
      .max(10, "Royalty must be less than 10%"),
  });
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
      icon: <TeleIcon width={24} height={24} className="fill-shader_600" />,
      title: "Telegram",
      name: "telegram",
      placeHolder: "https://t.me/",
      value: 99123,
    },
  ];

  const removeCollab = async (item: string) => {
    const newCollab = data.collaborators.filter((col: string) => {
      return col !== item;
    });
    await collectionService.updateCollection(
      {
        collaborators: newCollab,
      },
      collectionAddress,
      chainId
    );
    refetch();
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
  const queryClient = useQueryClient();
  console.log(data);

  const onSubmit = async (values: any) => {
    // Handle form submission
    try {
      await collectionService.updateCollection(
        {
          name: values.name,
          description: values.description,
          url: values.url,
          // category: values.category,
          collaborators: values.collaborator
            ? [...values.collaborators, values.collaborator]
            : values.collaborators,
          socials: {
            facebook: values.facebook,
            twitter: values.twitter,
            telegram: values.telegram,
            website: values.website,
          },
          category: values.category,
        },
        collectionAddress,
        chainId
      );
      if (selectedImage) {
        await collectionService.uploadFileCollection({
          featureImage: values.featureImage,
          chainId,
          collectionAddress,
        });
      }
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
      queryClient.refetchQueries(["detailCollection"]);
      router.push(
        `/collection/${collectionAddress}?typeERC=${typeERC}&chain=${chainId}`
      );
    } catch (error) {
      console.error(error);
    }
  };
  const initialValues = {
    name: data?.name,
    description: data?.description,
    url: data?.url,
    collaborators: data?.collaborators,
    collaborator: "",
    category: data?.category as string[],
    featureImage: data?.featureImage,
    twitter: data?.socials?.twitter,
    facebook: data?.socials?.facebook,
    telegram: data?.socials?.telegram,
    website: data?.socials?.website,
  };

  return (
    <div className="">
      <h1 className="mt-4 text-2xl font-semibold text-center">
        Edit Collection Details
      </h1>

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
                className="input_item"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-xs text-red"
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
                className="input_item"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-xs text-red"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                URL
              </label>
              <p className="mb-4 text-shader_600">
                Customize your URL on Demask. Must only contain lowercase
                letters, numbers, and hyphens.
              </p>
              <Field
                type="text"
                id="url"
                name="url"
                value={values.url}
                placeholder="https://Demask.finance/collection/abcdef"
                onChange={handleChange}
                className="input_item"
              />
              <ErrorMessage
                name="url"
                component="div"
                className="text-xs text-red"
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
                    className={`px-3 py-1 mb-4 mr-4 text-sm h-[34px] text-shader_600 border rounded-lg ${
                      values.category.includes(item.value) &&
                      "bg-shader_500 text-white"
                    }`}
                    key={item.id}
                    value={item.value}
                    onClick={() =>
                      selectCategory(item.value, values.category, setFieldValue)
                    }
                  ></Field>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                Featured image
              </label>
              <p className="mb-4 text-shader_600">
                This image will be used for featuring your collection on the
                homepage, category pages, or other display areas of Demask
              </p>
              <input
                type="file"
                id="featureImage"
                name="featureImage"
                // value={values.featureImage}
                onChange={(event) => {
                  if (
                    event.target.files &&
                    event.target.files[0].size < 10485760
                  ) {
                    const file = event.target.files[0];
                    setSelectedImage(file);
                    setFieldValue("featureImage", file);
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
                  className="flex flex-col items-center justify-center py-6 border rounded-lg cursor-pointer border-shader_500"
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
                  <div className="text-sm text-shader_500 ">
                    <span>Recommended size: 500 x 500</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                Collaborators
              </label>
              <p className="mb-4 text-shader_600">
                Collaborators can only edit how this collection or drop appears
                on Demask
              </p>
              {values?.collaborators &&
                values.collaborators.map((item: string, index: number) => (
                  <div
                    className="flex items-center justify-between p-2 mb-2 text-sm font-semibold rounded-lg bg-shader_600 text-shader_600"
                    key={index}
                  >
                    <p>{`${item.slice(0, 6)}...${item.slice(-8)}`}</p>
                    {index === 0 && <p className="text-sm">Owner</p>}
                    {index !== 0 && account === values?.collaborators[0] && (
                      <CgClose
                        className="text-xl transition-colors duration-100 ease-linear cursor-pointer hover:text-red"
                        onClick={() => removeCollab(item)}
                      />
                    )}
                  </div>
                ))}

              {checkCollaborator ? (
                <div>
                  <div className="flex items-center">
                    <Field
                      type="text"
                      id="collaborator"
                      name="collaborator"
                      value={values.collaborator}
                      placeholder="0x...123"
                      onChange={handleChange}
                      className="input_item"
                    />
                    <CgClose
                      className="mb-4 text-xl transition-colors duration-100 ease-linear cursor-pointer hover:text-red"
                      onClick={() => setCheckCollaborator(false)}
                    />
                  </div>
                  <ErrorMessage
                    name="collaborator"
                    component="div"
                    className="text-xs text-red"
                  />
                </div>
              ) : (
                <p
                  className="text-sm font-semibold cursor-pointer text-primary_500"
                  onClick={() => setCheckCollaborator(true)}
                >
                  + Add collaborator
                </p>
              )}
            </div>
            <label className={styles.title}>Social link</label>
            {socialList.map((item, index) => (
              <div key={index}>
                <div className="flex mt-4 gap-x-4">
                  <div className="flex p-2 font-normal rounded-lg bg-shader_500 min-w-[132px] gap-x-2 text-shader_600 ">
                    {item.icon}
                    {item.title}
                  </div>
                  <Field
                    type="text"
                    value={(values as any)[item.name]}
                    id={item.name}
                    name={item.name}
                    placeholder={item.placeHolder}
                    className="input_item"
                  />
                </div>
                <ErrorMessage
                  name={item.name}
                  component="div"
                  className="text-xs text-red"
                />
              </div>
            ))}
            <div className="flex justify-center mx-auto my-6 gap-x-6">
              <Button active>
                <Link
                  href={`/profile?chain=${chainId}`}
                  className="px-2 text-sm font-medium text-white rounded-lg"
                >
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                primary={dirty && !isSubmitting}
                active={!dirty || isSubmitting}
                disabled={!dirty || isSubmitting}
                className="px-6 py-2"
                isLoadingBtn={isSubmitting}
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
