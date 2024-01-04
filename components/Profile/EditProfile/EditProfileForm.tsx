import React from 'react'
import { Formik, Form, Field, useFormik, ErrorMessage } from 'formik';
import * as yup from 'yup';
export default function EditProfileForm() {
    const validationSchema = yup.object().shape({
        name: yup.string().nullable().notRequired().max(100),
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
    };
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
                <Form>
                    <div>
                        <label htmlFor="name">Name</label>
                        <Field type="text" id="name" name="name" />
                        <ErrorMessage name="name" component="div" className="text-red-500" />
                    </div>

                    <div>
                        <label htmlFor="website">Website</label>
                        <Field type="text" id="website" name="website" />
                        <ErrorMessage name="website" component="div" className="text-red-500" />
                    </div>

                    <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
                        Submit
                    </button>
                </Form>
            </Formik>
        </div>
    )
}
