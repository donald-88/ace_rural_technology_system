import React from 'react'
import { getTeam } from '@/lib/actions/team.actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TeamMemberType } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function Page() {
  const teamMembers = await getTeam()

  console.log(teamMembers)

  return (
    <section className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <Input type='search' placeholder='Search team members' className="h-8 w-[150px] lg:w-[350px]" />
        <Button size={"sm"}>Add Member</Button>
      </div>
      <Table className="border rounded-2xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-max">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-fit">Role</TableHead>
            <TableHead className="w-fit">Date Added</TableHead>
            <TableHead className="w-fit">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member: TeamMemberType) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium flex items-center gap-4 w-max">
                <Avatar>
                  <AvatarImage src={member.name} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                {member.name}
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell className="w-fit">
                {member.role}
              </TableCell>
              <TableCell className="w-fit">{member.createdAt}</TableCell>
              <TableCell className="w-fit">
                <Button size={"sm"} variant={"outline"}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}