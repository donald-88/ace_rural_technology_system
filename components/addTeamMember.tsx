import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import CustomFormField from './customFormField'
import { FormFieldType } from '@/lib/types'
import { roleOptions } from '@/constants'
import { toast } from 'sonner'
import { TeamMemberParams } from '@/types'
import { createTeamMemberAction } from '@/app/(root)/settings/teams/actions'

const AddTeamMember = () => {
    const [formData, setFormData] = useState<TeamMemberParams>({
        name: "",
        email: "",
        phone: "",
        role: ""
    });

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateTeamMember = async () => {
        try {
            setIsLoading(true);

            if (!formData.name || !formData.email || !formData.phone || !formData.role) {
                toast.error("Please fill in all fields");
                return;
            }

            const result = await createTeamMemberAction(formData);

            if (result.success) {
                toast.success("Team member created successfully!");
                setOpen(false);
                setFormData({ name: "", email: "", phone: "", role: "" });
            } else {
                toast.error(result.error || "Error creating team member");
            }
        } catch (error) {
            console.error("Error in handleCreateTeamMember:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <CustomFormField
                        fieldtype={FormFieldType.INPUT}
                        name="name"
                        id="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(value) => handleInputChange("name", value as string)}
                    />
                    <CustomFormField
                        fieldtype={FormFieldType.INPUT}
                        name="phone"
                        id="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(value) => handleInputChange("phone", value as string)}
                    />
                    <CustomFormField
                        fieldtype={FormFieldType.EMAIL}
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(value) => handleInputChange("email", value as string)}
                    />
                    <CustomFormField
                        fieldtype={FormFieldType.SELECT}
                        name="role"
                        id="role"
                        placeholder="Role"
                        options={roleOptions}
                        value={formData.role}
                        onChange={(value) => handleInputChange("role", value as string)}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreateTeamMember} disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddTeamMember