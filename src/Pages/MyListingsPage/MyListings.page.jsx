import React from 'react'
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function MyListingsPage() {
    const location = useLocation();
    const user = useSelector(state=>state.user.user);
    return (
      <div>
          <section className='w-full capitalize'>
              <div className='max-w-screen-lg mx-auto flex flex-col  px-10'>
                  <div className='flex gap-10 text-grayAccent1'>
                    {user && 
                    <>
{/*                     <Link to="drafted" className={`${location.pathname == "/mylistings/drafted"? " border-b-2 border-primaryA0 text-primaryA0" : ""}  pb-4  order-3`}>draft listing</Link> */}
                    <Link to="mylistings" className={`${location.pathname == "/mylistings/mylistings"? " border-b-2 border-primaryA0 text-primaryA0" : ""}  pb-4 order-1 `}>my listings</Link>
                    </>
                    }
                    <Link to="" className={`${location.pathname == "/mylistings"? " border-b-2 border-primaryA0 text-primaryA0" : ""}  pb-4 order-2`}>save listings</Link>
                  </div>
                  <hr/>
              </div>
              <Outlet />
          </section>
      </div>
    )
}
