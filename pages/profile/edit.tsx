import WithAuth from '@/components/Common/WithAuth'
import EditProfile from '@/components/Profile/EditProfile'
import React from 'react'

export default function EditPage() {
  return (
    <WithAuth>
      <EditProfile />
    </WithAuth>
  )
}
