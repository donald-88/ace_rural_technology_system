import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import CustomFormField from './customFormField'
import { FormFieldType } from '@/lib/types'
import { roleOptions } from '@/constants'
import { TeamMemberParams } from '@/types'
import { toast } from 'sonner'
import { createTeamMember } from '@/lib/actions/team-actions'

const AddTeamMember = () => {

    const newTeamMember: TeamMemberParams = {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        role: "admin"
    }

    const handleCreateTeamMember = async () => {
        console.log("New Team Member:", newTeamMember);
        const newMember = await createTeamMember(newTeamMember)

        newMember ? toast.success("Team member created successfully!") : toast.error("Error creating team member")
    }
  return (
      <Dialog>
          <DialogTrigger asChild>
              <Button><Plus size={16} />Add Member</Button>
          </DialogTrigger>
          <DialogContent onSubmit={handleCreateTeamMember} className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                  <DialogDescription>
                      Please fill in the details to add a new member.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4">
                  <CustomFormField fieldType={FormFieldType.INPUT} name="name" id="name" placeholder="Name" />
                  <CustomFormField fieldType={FormFieldType.INPUT} name="phone" id="phone" placeholder="Phone" />
                  <CustomFormField fieldType={FormFieldType.INPUT} name="email" id="email" placeholder="Email" />
                  <CustomFormField fieldType={FormFieldType.SELECT} name="role" id="role" placeholder="Role" options={roleOptions} />
              </div>
              <DialogFooter>
                  <Button type="submit">Add</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  )
}

export default AddTeamMember