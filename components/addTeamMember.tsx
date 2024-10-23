import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import CustomFormField from './customFormField'
import { FormFieldType } from '@/lib/types'
import { roleOptions } from '@/constants'
import { toast } from 'sonner'
import { createTeamMember } from '@/lib/actions/team-actions'
import { TeamMemberParams } from '@/types'

const AddTeamMember = () => {

    const [formData, setFormData] = useState<TeamMemberParams>({
        name: "",
        email: "",
        phone: "",
        role: ""
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateTeamMember = async () => {
        console.log("New Team Member:", formData);
        const newMember = await createTeamMember(formData);
        newMember
            ? toast.success("Team member created successfully!")
            : toast.error("Error creating team member");
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button><Plus size={16} />Add Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Please fill in the details to add a new member.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    <CustomFormField fieldType={FormFieldType.INPUT} name="name" id="name" placeholder="Name" value={formData.name} onChange={(value) => handleInputChange("name", value as string)} />
                    <CustomFormField fieldType={FormFieldType.INPUT} name="phone" id="phone" placeholder="Phone" value={formData.phone} onChange={(value) => handleInputChange("phone", value as string)} />
                    <CustomFormField fieldType={FormFieldType.INPUT} name="email" id="email" placeholder="Email" value={formData.email} onChange={(value) => handleInputChange("email", value as string)} />
                    <CustomFormField fieldType={FormFieldType.SELECT} name="role" id="role" placeholder="Role" options={roleOptions} value={formData.role} onChange={(value) => handleInputChange("role", value as string)} />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreateTeamMember}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddTeamMember