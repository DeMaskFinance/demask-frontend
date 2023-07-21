import React from 'react'
import { BiLoaderAlt } from 'react-icons/bi'

export default function ChartLoading() {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <BiLoaderAlt className="mb-6 text-5xl animate-spin text-secondary5" />
      <p className='mb-1 text-sm font-medium text-dark1'>Loading data</p>
      <p className='text-sm text-dark2'>Please wait a moment.</p>
    </div>
  )
}
