import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function AccountPage() {
    const location = useLocation();
  return (
    <div>
        <section className='w-full capitalize'>
            <div className='max-w-screen-lg mx-auto flex flex-col  px-10'>
                <div className='flex gap-10 text-grayAccent1'>
                    <Link to="" className={`${location.pathname == "/account"? " border-b-2 border-primaryA0 text-primaryA0" : ""}  pb-4  `}>account settings</Link>
                    <Link to="payment" className={`${location.pathname == "/account/payment"? " border-b-2 border-primaryA0 text-primaryA0" : ""}  pb-4 `}>payment</Link>
                </div>
                <hr/>
                <div>
                    <Outlet />
                </div>
            </div>
            
        </section>
    </div>
  )
}
