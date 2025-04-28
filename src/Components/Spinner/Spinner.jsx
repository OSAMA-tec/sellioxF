import React from 'react'

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  )
}
