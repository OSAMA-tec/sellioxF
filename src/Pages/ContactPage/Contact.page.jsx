import React from 'react'
import aboutImg from "../../assets/images/about.png";
export default function ContactPage() {
  return (
    <div className='capitalize max-w-screen-lg mx-auto mt-20 mb-40 flex flex-col gap-6 px-10'>
        <section>
            <h2 className='text-3xl'>contact us</h2>
        </section>
        <section className='grid grid-cols-1 md:grid-cols-2 bg-inputAccent1 py-16 gap-8 px-8 rounded-lg shadow-2xl'>
            <div className='flex flex-col gap-4 text-sm items-center justify-center'>
                <form className='flex flex-col gap-2 shadow-lg px-7 py-4 rounded-md w-full'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='fullName'>full name</label>
                        <input 
                        type='text'
                        id='fullName'
                        className='border py-2 px-1 bg-transparent'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='email'>email address</label>
                        <input 
                        type='email'
                        id='email'
                        className='border py-2 px-1 bg-transparent'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='website'>website</label>
                        <input 
                        type='text'
                        id='website'
                        className='border py-2 px-1 bg-transparent'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='message'>message</label>
                        <textarea
                        rows={3}
                        type='text'
                        id='message'
                        className='border py-2 px-1 bg-transparent'
                        />
                    </div>
                    <div className='mt-4'>
                        <button className='btn-primary w-3/6 !block'>send</button>
                    </div>
                    
                </form>
            </div>
            <div>
                <img src={aboutImg} alt='about image'/>
            </div>
        </section>  
    </div>
  )
}
