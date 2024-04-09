import React, { useContext, useState } from "react";
import { Formik, Form, Field, useFormik, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import { Button } from "@/components/Buttons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile, userData } from "@/store/profileSlice";
import * as userService from "@/libs/service/userService";
import { useRouter } from "next/router";
import AccountContext from "@/context/AccountContext";
const styles = {
  title: "block my-4 text-base font-semibold text-black24",
  inputItem:
    "block w-full py-2 pl-2 border rounded-lg outline-none border-dark3 placeholder:text-sm hover:border-secondary3 focus:border-secondary3 dark:bg-darkBG2 dark:border-darkBG2",
  btnActive: "rounded-full bg-base2",
};
const validationSchema = yup.object().shape({
  name: yup.string().nullable().notRequired().max(50),
  about: yup.string().max(200).nullable(),
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
});

export default function EditProfileForm() {
  const { profile } = useSelector(selectProfile);
  const { account, chainId } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const socialList = [
    {
      icon: <WebsiteIcon width={24} height={24} />,
      title: "Website",
      name: "website",
      placeHolder: "https://",
      value: profile?.socials?.website,
    },
    {
      icon: <TwitterIcon width={24} height={24} />,
      title: "Twitter",
      name: "twitter",
      placeHolder: "https://twitter.com/",
      value: profile?.socials?.twitter,
    },
    {
      icon: <FacebookIcon width={24} height={24} />,
      title: "Facebook",
      name: "facbook",
      placeHolder: "https://facebook.com/",
      value: profile?.socials?.facebook,
    },
    {
      icon: <TeleIcon width={24} height={24} className="fill-dark2" />,
      title: "Telegram",
      name: "telegram",
      placeHolder: "https://t.me/",
      value: profile?.socials?.telegram,
    },
    {
      icon: <DiscordIcon width={24} height={24} />,
      title: "Discord",
      name: "discord",
      placeHolder: "https://discord.com/",
      value: profile?.socials?.discord,
    },
    {
      icon: <GithubIcon width={24} height={24} />,
      title: "Github",
      name: "github",
      placeHolder: "https://github.com/",
      value: profile?.socials?.github,
    },
  ];
  const initialValues = {
    name: profile?.name,
    userName: profile?.userName,
    about: profile?.about,
    twitter: profile?.socials?.twitter,
    facebook: profile?.socials?.facebook,
    discord: profile?.socials?.discord,
    telegram: profile?.socials?.telegram,
    website: profile?.socials?.website,
  };
  const onSubmit = async (values: any) => {
    // Handle form submission
    try {
      setLoading(true);
      const newUserData = await userService.updateUserInfor({
        userName: values.userName,
        name: values.name,
        about: values.about,
        socials: {
          facebook: values.facebook,
          twitter: values.twitter,
          telegram: values.telegram,
          discord: values.discord,
          website: values.website,
          github: values.github,
        },
      });
      dispatch(userData({ profile: newUserData.data }));
      router.push("/profile");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          dirty,
        }) => (
          <Form className="mx-auto max-w-[600px]">
            <div className="flex flex-col">
              <label htmlFor="name" className={styles.title}>
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={styles.inputItem}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-2 text-xs text-red"
              />
            </div>

            <div className="flex flex-col overflow-hidden">
              <label htmlFor="userName" className={styles.title}>
                Username
              </label>
              <div className={`${styles.inputItem} flex`}>
                <p className="mr-1">@</p>
                {profile?.userName}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="about" className={styles.title}>
                About
              </label>
              <Field
                as="textarea"
                type="text"
                id="about"
                name="about"
                value={values.about}
                placeholder="Tell about yourself"
                className={styles.inputItem}
              />
              <ErrorMessage
                name="about"
                component="div"
                className="text-red-500"
              />
            </div>
            <label className={styles.title}>Social link</label>
            {socialList.map((item, index) => (
              <div key={index}>
                <div className="flex mt-4 gap-x-4">
                  <div className="flex p-2 font-normal rounded-lg bg-dark4 min-w-[132px] gap-x-2 text-dark2 dark:bg-dark1 dark:text-white">
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
                href={`/profile?chain=${chainId}`}
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
}
