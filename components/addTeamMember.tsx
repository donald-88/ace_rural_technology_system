import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

const AddTeamMember = () => {
  return (
      <Dialog>
          <DialogTrigger asChild>
              <Button><Plus size={16} />Add Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  
              </div>
              <DialogFooter>
                  <Button type="submit">Save changes</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  )
}

export default AddTeamMember