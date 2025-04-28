import React from 'react'
import { FaStar } from 'react-icons/fa'

const Rating = React.memo(({roundRating,rating}) =>{
  return (
    <div className='flex py-2 items-center gap-1'>
      {rating && <p className=''>({rating})</p> } 
    <div className='flex gap-2 '>{Array.from({length:roundRating}).map((_,i)=>{
        return <FaStar key={i} size={12} className='text-yellow-400'/>
        })}
    </div>   
             
    </div>
    
  )
});

export default Rating;
