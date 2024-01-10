import WithAuth from '@/components/LaunchPad/components/WithAuth'
import EditProfile from '@/components/Profile/EditProfile'
import React from 'react'

export default function EditPage() {
  return (
    <WithAuth>
      <EditProfile />
    </WithAuth>
  )
}
