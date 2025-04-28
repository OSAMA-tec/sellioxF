import React, { useState } from 'react'
import {categories} from '../../data/links'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCategory, setSearchSubCategory } from '../../redux/slices/search.slice';
import styles from '../../Components/Dropdown/dropdown.module.css';

export default function BrowseMenu({menuStyle,className}) {
    //  const [links , setLinks] = useState(categories);
    const searchCategory = useSelector(state=>state.search.category);
    const oldSub = useSelector(state=>state.search.subCategory);
    const dispatch = useDispatch();
    const handleSubCategory = (subCategory, category)=>{      
      // if(oldSub === subCategory){
        // dispatch(setSearchSubCategory(""))
      // }else{
        // dispatch(setSearchSubCategory({category, subCategory}))
        dispatch(setSearchCategory(category))
      // } 
      // document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    }
  return (
    <div className={`${className} flex flex-col max-w-screen-lg mx-auto mt-2 px-4`}>
     <div className='grid grid-cols-1 md:grid-cols-4 py-3 gap-3'>
     {/* <h4 className='hover:text-slate-500 hover:cursor-pointer' onClick={()=>setLinks(categories["domestic"])}>domestic links</h4>
     <h4 className='hover:text-slate-500 hover:cursor-pointer ' onClick={()=>setLinks(categories["event & entertainment"])}>EVENT & ENTERTAINMENT</h4>
     <h4 className='hover:text-slate-500 hover:cursor-pointer ' onClick={()=>setLinks(categories["trade"])}>TRADE</h4>
     <h4 className='hover:text-slate-500 hover:cursor-pointer' onClick={()=>setLinks(categories["other"])}>OTHER</h4> */}
     {/* <h4 className='hover:text-slate-500 hover:cursor-pointer'>Domestic links</h4>
     <h4 className='hover:text-slate-500 hover:cursor-pointer '>EVENT & ENTERTAINMENT</h4>
     <h4 className='hover:text-slate-500 hover:cursor-pointer '>TRADE</h4>
     <h4 className='hover:text-slate-500 hover:cursor-pointer'>OTHER</h4> */}
     </div>
        <div className={`${menuStyle} w-full grid grid-cols-1 md:grid-cols-4 py-3`}>
          {Object.keys(categories).map(link=>{
               return(
          <div className='flex flex-col text-grayAccent1 text-sm my-3 gap-1' key={link}>
              <h4 className='text-titleBlack mb-3 text-base'>{link}</h4>
              <hr className='border-2 mb-2'/>
              {/* {link.links.map((sub,j)=>{
                  return(
                  <span style={{ color: oldSub == sub && "rgba(var(--primary-a0))" }}
                  className='hover:text-primaryA0 hover:cursor-pointer'
                  key={j}
                  onClick={()=>handleSubCategory(sub, link.header)}>
                        {sub}
                  </span>)
              })} */}
              {categories[link].map((v,k)=>(
                <span style={{ color: oldSub == v && "rgba(var(--primary-a0))" }}
                  className='hover:text-primaryA0 hover:cursor-pointer'
                  key={k}
                  onClick={()=>handleSubCategory('',v['header'])}
                >
                  {v['header']}
                </span>
              ))}
          </div>
               )
          })}
        </div>
    </div>
  )
}
