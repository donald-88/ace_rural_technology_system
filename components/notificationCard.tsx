import { CircleX, TriangleAlert } from 'lucide-react'
import React from 'react'

const NotificationCard = () => {
    return (
        <div className='w-full h-20 flex items-center gap-4 border border-blue-100 bg-blue-50 rounded-lg p-4'>
            <TriangleAlert size={20} color='#0052EA' />
            <div className='grow'>
                <h4>Motion Detected</h4>
                <p className='text-gray-500 text-sm'>Provide users with non-disruptive feedback or the status of an action</p>
            </div>
            <h4>20:32</h4>
            <CircleX size={20} color='#5D5F5D' />
        </div>
    )
}

export default NotificationCard