import React from 'react'
import { CiLocationOn } from 'react-icons/ci';
export default function BusinessCard({businessCard}) {
  return (
    <div className=' w-full h-full shadow-2xl px-4 py-3 flex flex-col  justify-around rounded-lg border'>
        <div className='flex justify-center gap-10 items-center mb-3'>
            <div className='flex flex-col items-center justify-center gap-2'>
            <img src={businessCard?.logo} className='w-16 h-16  rounded-full' />
            <h5>{businessCard?.businessTitle}</h5>
            </div>
            
        </div>
        <hr/>
        <div className='flex flex-col items-center gap-2 py-3'>
            <p className='flex  gap-2'>
                <CiLocationOn size={20}/>
                <span>{businessCard?.location}</span>
            </p>
        </div>
        <hr/>
        <ul className='py-2 text-sm flex flex-col justify-start gap-3 '>
            {businessCard && businessCard?.services?.map((s,i)=>{
                return <li key={i}>{s} </li>
            })}
        </ul>
        <hr/>
        <p className='py-3 text-xs text-grayAccent1'>{businessCard?.businessInfo}</p>
        <hr/>
        <p className=' py-3 font-extralight underline  normal-case text-center'>{businessCard?.businessWebsite}</p>
        <hr/>  
    </div>
  )
}
