import React, { useRef } from 'react'
import EditProfileForm from './EditProfileForm'
import { AvatarUser } from '@/components/Avatars'
import { EditIcon } from '@/components/Icons'

export default function EditProfile() {
  const inputAvatar = useRef(null);
  return (
    <div className=''>
      <div className='relative'>
        <div className='w-full h-[240px] bg-dark4 rounded-b-lg'>

        </div>
        <div className='absolute top-0 left-0 flex-col items-center justify-center w-full h-full text-white rounded-full group-hover:flex'
          onClick={() => {
            if (inputAvatar.current) {
              (inputAvatar.current as HTMLInputElement).click();
            }
          }}
        >
          <EditIcon width={32} height={32} />
          <p className='text-xs'>1200 x 400 Recommended</p>
        </div>
      </div>
      <h1 className='mt-8 text-xl font-semibold text-center'>Edit My Profile</h1>
      <div className='flex justify-center my-6'>
        <div className='relative rounded-full cursor-pointer w-fit h-fit group'>
          <div className='group-hover:brightness-50'>
            <AvatarUser width={120} height={120} />
          </div>
          <div className='absolute top-0 left-0 flex-col items-center justify-center hidden w-full h-full text-white rounded-full group-hover:flex'
            onClick={() => {
              if (inputAvatar.current) {
                (inputAvatar.current as HTMLInputElement).click();
              }
            }}
          >
            <EditIcon width={32} height={32} />
            <p className='text-xs'>600 x 600px</p>
          </div>

        </div>
        <div>
          <input type="file" ref={inputAvatar} accept="image/png,image/jpeg,image/gif"
            onChange={async (e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                if (file) {
                  console.log(file);

                }
              }
            }}
            className='hidden'
          />
        </div>
      </div>
      <EditProfileForm />
    </div>
  )
}
