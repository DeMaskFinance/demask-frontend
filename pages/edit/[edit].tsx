import EditFormCollection from '@/components/CreatedCollection/EditFormCollection'
import React from 'react'
import { SEO } from '../../next-seo.config';
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: 'Edit Collection',
};
const EditCollection = () => {
  return (
    <div>
      <NextSeo {...updateMeta} />
      <EditFormCollection/>
    </div>
  )
}

export default EditCollection;
