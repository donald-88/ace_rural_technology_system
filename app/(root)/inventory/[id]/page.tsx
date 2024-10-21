import { getInventoryById } from '@/lib/actions/inventory-actions'
import React from 'react'

const ViewDetails = ({ params }: { params: { id: string } }) => {
  const data = getInventoryById(params.id)
  console.log(data)
  return (
    <div>
      <h1>View Details</h1>
    </div>
  )
}

export default ViewDetails