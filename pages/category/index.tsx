import { SkeletonReels } from '@/components/Skeleton'
import Head from 'next/head'
import React from 'react'

export default function Category() {
  return (
    <section className="category">
      <Head>
        <title>Category | DeMask</title>
      </Head>
      <div className='w-full h-[60vh] text-4xl text-dark1 font-medium'>
        {/* <p>Under construction</p> */}
        <SkeletonReels/>
      </div>
    </section>
  )
}
