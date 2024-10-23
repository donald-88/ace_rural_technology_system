"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const roleOptions = ["ADMIN", "USER"]; // Sample role options

const General = () => {
  const [openDialog, setOpenDialog] = useState({ name: false, phone: false, email: false, role: false });
  const [formData, setFormData] = useState({
    name: 'Sophie Banda',
    phone: '123-456-7890',
    email: 'sophiebanda@gmail.com',
    role: roleOptions[0],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (field: string) => {
    console.log(`${field} updated:`, formData[field]);
    setOpenDialog({ ...openDialog, [field]: false });
  };

  return (
    <section className='p-4'>
      <div className='grid gap-3'>
        <h2>Profile Settings</h2>

        {/* Name */}
        <div className='flex justify-between items-center py-4 border-t border-b border-muted'>
          <h3>Name</h3>
          <p>{formData.name}</p>
          <Button variant={"outline"} onClick={() => setOpenDialog({ ...openDialog, name: true })}>Edit</Button>
        </div>

        {/* Dialog for editing Name */}
        <Dialog open={openDialog.name} onOpenChange={(open) => setOpenDialog({ ...openDialog, name: open })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
              <DialogDescription>
                Update your name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="input-class"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => handleSave("name")}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Phone */}
        <div className='flex justify-between items-center py-4 border-b border-muted'>
          <h3>Phone</h3>
          <p>{formData.phone}</p>
          <Button variant={"outline"} onClick={() => setOpenDialog({ ...openDialog, phone: true })}>Edit</Button>
        </div>

        {/* Dialog for editing Phone */}
        <Dialog open={openDialog.phone} onOpenChange={(open) => setOpenDialog({ ...openDialog, phone: open })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Phone</DialogTitle>
              <DialogDescription>
                Update your phone number.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="input-class"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => handleSave("phone")}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email */}
        <div className='flex justify-between items-center py-4 border-b border-muted'>
          <h3>Email Address</h3>
          <p>{formData.email}</p>
          <Button variant={"outline"} onClick={() => setOpenDialog({ ...openDialog, email: true })}>Edit</Button>
        </div>

        {/* Dialog for editing Email */}
        <Dialog open={openDialog.email} onOpenChange={(open) => setOpenDialog({ ...openDialog, email: open })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Email</DialogTitle>
              <DialogDescription>
                Update your email address.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="input-class"
              />
            </div>
            <DialogFooter>
              <Button onClick={() => handleSave("email")}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role */}
        <div className='flex justify-between items-center py-4 border-b border-muted'>
          <h3>Role</h3>
          <p>{formData.role}</p>
          <Button variant={"outline"} onClick={() => setOpenDialog({ ...openDialog, role: true })}>Edit</Button>
        </div>

        {/* Dialog for editing Role */}
        <Dialog open={openDialog.role} onOpenChange={(open) => setOpenDialog({ ...openDialog, role: open })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update your role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="select-class"
              >
                {roleOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button onClick={() => handleSave("role")}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <h2>Preferences</h2>
        <div className='flex justify-between items-center py-4 border-t border-b border-muted'>
          <h3>Notifications</h3>
          <p className='text-center'>SMS</p>
          <Button variant={"outline"}>Edit</Button>
        </div>
      </div>
    </section>
  );
};

export default General;
