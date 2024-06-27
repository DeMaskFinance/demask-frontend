import AccountContext from "@/context/AccountContext";
import { Category, validCollectionInput } from "@/libs/constants";
import * as collectionService from "@/libs/service/collectionService";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "../Buttons";
import {
  FacebookIcon,
  LeftIcon,
  PlusIcon,
  TeleIcon,
  TwitterIcon,
  UploadIcon,
  WebsiteIcon,
} from "../Icons";
import useFileHandler from "@/hooks/useFileHandler";
import { UploadFileCollection } from "../Create/UploadFile";
import { uploadFileIPFSCollection } from "@/libs/service/IPFSService";
import Image from "next/image";

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
  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileType, setFileType] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const collectionAddress = useRouter().query.edit as string;
  console.log(data);

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is a required").max(50),
    description: yup.string().required("Description is a required").max(1000),
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
      icon: <WebsiteIcon width={20} height={20} />,
      title: "Website",
      name: "website",
      placeHolder: "https://",
      value: 123,
    },
    {
      icon: <TwitterIcon width={20} height={20} />,
      title: "Twitter",
      name: "twitter",
      placeHolder: "https://twitter.com/",
      value: 612,
    },
    {
      icon: <FacebookIcon width={20} height={20} />,
      title: "Facebook",
      name: "facbook",
      placeHolder: "https://facebook.com/",
      value: 53342,
    },
    {
      icon: <TeleIcon width={20} height={20} className="fill-shader_600" />,
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
      if (selectedFile) {
        await collectionService.uploadFileCollection({
          avatar: values.avatar,
          chainId,
          collectionAddress,
        });
      }
      toast.success("Updated Successed");
      queryClient.refetchQueries(["detailCollection"]);
      setSelectedImage("");
    } catch (error) {
      toast.error("Updated Error");
      console.error(error);
    }
  };
  const initialValues = {
    name: data?.name,
    avatar: data?.avatar,
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
  console.log(data, initialValues);

  return (
    <div className="mx-auto max-w-[634px] mb-16">
      <div
        className="flex items-center cursor-pointer gap-x-2 my-6 "
        onClick={() => router.back()}
      >
        <LeftIcon width={20} height={20} />

        <p className="font-semibold text-white">Back</p>
      </div>
      <h1 className="text-xl font-bold text-primary_300 mb-4">
        Edit Collection
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, handleChange, isSubmitting, dirty, setFieldValue }) => {
          return (
            <Form className="font-semibold">
              <div className="flex flex-col">
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
                <label htmlFor="name" className="title_label mt-5">
                  Name
                  <p className="text-primary_400">*</p>
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
                <label
                  htmlFor="description"
                  className={`title_label flex justify-between`}
                >
                  <div className="flex">
                    Description
                    <p className="text-primary_400">*</p>
                  </div>
                  <p className="font-normal text-shader_300 text-sm">
                    {values.description?.length | 0}/1000
                  </p>
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
                <label htmlFor="name" className="title_label">
                  URL
                </label>
                <p className="mb-4 text-shader_200 text-sm font-normal">
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
                <p className="title_label">Category</p>
                <div className="flex">
                  {Category.map((item, index) => (
                    <div key={index}>
                      <Field
                        type="button"
                        name="category"
                        id="category"
                        className={`px-3 py-1 mb-4 mr-4 text-sm h-[34px] text-white border-shader_500  border rounded-lg cursor-pointer ${
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
              <div className="flex flex-col">
                <label htmlFor="name" className="title_label">
                  Featured image
                </label>
                <p className="mb-4 text-shader_200 text-sm font-normal">
                  This image will be used for featuring your collection on the
                  homepage, category pages, or other display areas of Demask.
                  Recommended size: 500 x500px - Type: Png, Jpeg, Gif ( 50 MB)
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
                    className="flex flex-col items-center justify-center py-2 border rounded-lg cursor-pointer border-shader_500"
                  >
                    {selectedImage ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="selected image"
                          width={360}
                          height={360}
                          className="object-cover w-40 rounded-lg mx-auto h-40 mb-4"
                        />
                        <div
                          className="text-white absolute top-1 right-1 bg-shader_400 rounded-full p-1 text-xs font-bold cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage("");
                            setFieldValue("featureImage", "");
                          }}
                        >
                          <CgClose />
                        </div>
                      </div>
                    ) : (
                      <div className=" h-40 flex items-center justify-center flex-col">
                        <div className="h-10 w-10 bg-primary_500 bg-opacity-25 rounded-lg flex justify-center items-center">
                          <UploadIcon
                            width={24}
                            height={24}
                            className=" text-primary_400"
                          />
                        </div>
                        <div className="text-sm text-shader_200 mt-2">
                          <span>
                            Click here or drag and drop to upload image
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className="title_label">
                  Collaborators
                </label>
                <p className="mb-4 text-shader_200 text-sm font-normal">
                  Collaborators can only edit how this collection or drop
                  appears on Demask
                </p>
                {values?.collaborators &&
                  values.collaborators.map((item: string, index: number) => (
                    <div
                      className="flex items-center justify-between p-2 mb-2 text-sm font-semibold rounded-lg bg-shader_600 text-shader_200"
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
                  <Button
                    className="w-fit flex gap-x-2"
                    third
                    onClick={() => setCheckCollaborator(true)}
                  >
                    <PlusIcon width={20} height={20} />
                    Add collaborator
                  </Button>
                )}
              </div>
              <label className="title_label">Social Links</label>
              {socialList.map((item, index) => (
                <div key={index}>
                  <div className="flex mb-4 gap-x-4 input_item items-center">
                    <div className="">{item.icon}</div>
                    <Field
                      type="text"
                      value={(values as any)[item.name]}
                      id={item.name}
                      name={item.name}
                      placeholder={item.placeHolder}
                      className=" text-shader_100 font-semibold w-full  placeholder:text-shader_300 bg-shader_600 outline-none "
                    />
                  </div>
                  <ErrorMessage
                    name={item.name}
                    component="div"
                    className="text-xs text-red"
                  />
                </div>
              ))}
              <Button
                type="submit"
                primary={dirty && !isSubmitting}
                active={!dirty || isSubmitting}
                disabled={!dirty || isSubmitting}
                className="px-6 py-2 cursor-pointer"
                isLoadingBtn={isSubmitting}
              >
                Save changes
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EditFormCollection;
