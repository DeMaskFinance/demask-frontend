import React from 'react'
import { Formik, Form, Field, useFormik, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { DiscordIcon, FacebookIcon, GithubIcon, GmailIcon, TeleIcon, TwitterIcon, WebsiteIcon } from '@/components/Icons';
import { Button } from '@/components/Buttons';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectProfile } from '@/store/profileSlice';

const styles = {
    title: "block my-4 text-base font-semibold text-black24",
    inputItem: "block w-full py-2 pl-2 border rounded-lg outline-none border-dark3 placeholder:text-sm hover:border-secondary3 focus:border-secondary3",
    btnActive: "rounded-full bg-base2",
};
const validationSchema = yup.object().shape({
    name: yup.string().nullable().notRequired().max(50),
    username: yup
        .string()
        .nullable()
        .notRequired()
        .max(50)
        .matches(/^[\w\d_]+$/, {
            message:
                'Username must only contain alphanumeric characters and symbol "_"',
            excludeEmptyString: true,
        }),
    about: yup.string().max(200),
    twitter: yup
        .string()
        .max(200)
        .matches(/^(https:\/\/twitter.com\/).+$/, {
            message: "Invalid twitter url",
            excludeEmptyString: true,
        }),
    facebook: yup
        .string()
        .max(200)
        .matches(/^(https:\/\/facebook.com\/).+$/, {
            message: "Invalid facebook url",
            excludeEmptyString: true,
        }),
    discord: yup
        .string()
        .max(200)
        .matches(/^(https:\/\/discord.com\/).+$/, {
            message: "Invalid discord url",
            excludeEmptyString: true,
        }),
    telegram: yup
        .string()
        .max(200)
        .matches(/^(https:\/\/t.me\/).+$/, {
            message: "Invalid telegram url",
            excludeEmptyString: true,
        }),
    website: yup.string().url().nullable(),
});
const initialValues = {
    name: '',
    username: '',
    about: '',
    twitter: '',
    facebook: '',
    discord: '',
    telegram: '',
    website: '',
    gmail: '',
};
export default function EditProfileForm() {
    const { profile } = useSelector(selectProfile);
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
            icon: <TeleIcon width={24} height={24} className='fill-dark2' />,
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
    ]
    const onSubmit = (values: any) => {
        // Handle form submission
        console.log('Form submitted with values:', values);
    };
    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form className='mx-auto max-w-[600px]'>
                    <div className='flex flex-col'>
                        <label htmlFor="name" className={styles.title}>Name</label>
                        <Field type="text" id="name" name="name" value={profile?.name} placeholder="Enter your name" className={styles.inputItem} />
                        <ErrorMessage name="name" component="div" className="mt-2 text-xs text-red" />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="username" className={styles.title}>Username</label>
                        <Field type="text" id="username" name="username" value={profile?.username} placeholder="Enter your username" className={styles.inputItem} />
                        <ErrorMessage name="username" component="div" className="text-red-500" />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="about" className={styles.title}>About</label>
                        <Field as="textarea" type="text" id="about" name="about" value={profile?.about} placeholder="Tell about yourself" className={styles.inputItem} />
                        <ErrorMessage name="about" component="div" className="text-red-500" />
                    </div>
                    <p className={styles.title}>Social link</p>
                    {socialList.map((item, index) => (
                        <div key={index}>
                            <div className='flex mt-4 gap-x-4'>
                                <div className='flex p-2 font-normal rounded-lg bg-dark4 min-w-[132px] gap-x-2 text-dark2'>
                                    {item.icon}
                                    {item.title}
                                </div>
                                <Field type="text" value={item.value} id={item.name} name={item.name} placeholder={item.placeHolder} className={styles.inputItem} />
                            </div>
                            <ErrorMessage name={item.name} component="div" className="mt-2 text-xs text-red" />
                        </div>
                    ))}

                    <div className='flex justify-center mx-auto my-6 gap-x-6'>
                        <Link href='/profile' className='px-6 py-2 text-sm font-medium text-white rounded-lg bg-dark3' >
                            Cancel
                        </Link>
                        <Button type="submit" primary className='px-6 py-2'>
                            Save
                        </Button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}
