import { Button } from '@/components/ui/button'
import React from 'react'

const General = () => {
  return (
    <section className='p-4'>
      <div className='grid gap-3'>
        <h2 className=''>Profile Settings</h2>
        <div className='flex justify-between items-center py-4 border-t border-b border-muted'>
          <h3>Phone</h3>
          <p>Sophie Banda</p>
          <Button variant={"outline"}>Edit</Button>
        </div>

        <div className='flex justify-between items-center py-4 border-b border-muted'>
          <h3>Email Address</h3>
          <p>sophiebanda@gmail.com</p>
          <Button variant={"outline"}>Edit</Button>
        </div>

        <div className='flex justify-between items-center py-4 border-b border-muted'>
          <h3>Phone</h3>
          <p>Sophie Banda</p>
          <Button variant={"outline"}>Edit</Button>
        </div>

        <div className='flex justify-between items-center py-4 border-b border-muted'>
          <h3>Role</h3>
          <p>ADMIN</p>
          <Button variant={"outline"}>Edit</Button>
        </div>

        <h2>Preferences</h2>
        <div className='flex justify-between items-center py-4 border-t border-b border-muted'>
          <h3>Notifications</h3>
          <p className='text-center'>SMS</p>
          <Button variant={"outline"}>Edit</Button>
        </div>
      </div>
    </section>
  )
}

export default General