import { Button } from "@/components/Buttons";
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import * as userService from "@/libs/service/userService";
import { selectProfile, userData } from "@/store/profileSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().nullable().notRequired().max(50),
  about: yup.string().max(30).nullable(),
  twitter: yup
    .string()
    .max(200)
    .matches(/^(https:\/\/x.com\/).+$/, {
      message: "Invalid twitter url",
      excludeEmptyString: true,
    })
    .nullable(),
  facebook: yup
    .string()
    .max(200)
    .matches(
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/.(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
      {
        message: "Invalid facebook url",
        excludeEmptyString: true,
      }
    )
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const socialList = [
    {
      icon: <WebsiteIcon width={20} height={20} />,
      title: "Website",
      name: "website",
      placeHolder: "https://",
      value: profile?.socials?.website,
    },
    {
      icon: <TwitterIcon width={20} height={20} />,
      title: "Twitter",
      name: "twitter",
      placeHolder: "https://x.com/",
      value: profile?.socials?.twitter,
    },
    {
      icon: <TeleIcon width={20} height={20} className="fill-shader_600" />,
      title: "Telegram",
      name: "telegram",
      placeHolder: "https://t.me/",
      value: profile?.socials?.telegram,
    },
    {
      icon: <DiscordIcon width={20} height={20} />,
      title: "Discord",
      name: "discord",
      placeHolder: "https://discord.com/",
      value: profile?.socials?.discord,
    },
    {
      icon: <GithubIcon width={20} height={20} />,
      title: "Github",
      name: "github",
      placeHolder: "https://github.com/",
      value: profile?.socials?.github,
    },
    {
      icon: <FacebookIcon width={20} height={20} />,
      title: "Facebook",
      name: "facbook",
      placeHolder: "https://facebook.com/",
      value: profile?.socials?.facebook,
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
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          dirty,
        }) => (
          <Form className="">
            <div className="flex flex-col ">
              <label htmlFor="name" className="title_label">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input_item placeholder:text-shader_300 text-shader_100 font-semibold"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-xs text-red"
              />
            </div>

            <div className="flex flex-col overflow-hidden ">
              <label htmlFor="userName" className="title_label">
                Username
              </label>
              <div
                className={
                  "w-full py-2 pl-2 flex bg-shader_600 rounded-lg transition-all duration-200 text-shader_300"
                }
              >
                <p className="mr-1">@</p>
                {profile?.userName}
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="about"
                className={`title_label flex justify-between`}
              >
                About
                <p className="font-normal text-shader_300 text-sm">
                  {values.about?.length}/1000
                </p>
              </label>
              <Field
                as="textarea"
                type="text"
                id="about"
                name="about"
                value={values.about}
                placeholder="Tell about yourself"
                className="input_item text-shader_100 font-semibold"
              />
              <ErrorMessage
                name="about"
                component="div"
                className="text-red text-sm"
              />
            </div>
            <label className="title_label">Social link</label>
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

            <div className=" my-4">
              <Button
                type="submit"
                primary={dirty}
                active={!dirty}
                disabled={!dirty}
                className="px-6 py-2"
                isLoadingBtn={loading}
              >
                Save changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
