import React from 'react';
import aboutImg from "../../assets/images/about.png";

export default function AboutPage() {
  return (
    <div className='capitalize max-w-screen-lg mx-auto my-10 flex flex-col gap-6 px-10'>
        <section>
            <h2 className='text-3xl'>about us</h2>
            <p>Everything you might want to know about us.</p>
        </section>
        <section className='grid grid-cols-1 md:grid-cols-2 bg-inputAccent1 py-16 gap-8 px-8 rounded-lg shadow-2xl'>
            <div className='flex flex-col gap-4 text-sm items-center justify-center'>
                <p>
                    Lorem ipsum dolor sit amet consectetur. Purus sit feugiat fermentum congue lacus porttitor euismod tristique. 
                    At interdum ultricies nunc risus sodales leo tristique iaculis consequat. 
                    Tellus quis amet eget risus aliquam cras dignissim eget a. Sit viverra a senectus enim. 
                    Turpis condimentum habitant senectus pellentesque nibh ac in id porttitor. 
                </p>
                <p>
                Commodo lectus amet nec viverra amet. Purus scelerisque aliquam sed purus diam. 
                Commodo viverra quam duis consectetur lectus pellentesque. 
                Venenatis etiam egestas iaculis vitae viverra nunc est nascetur ante. 
                Mi vitae id purus cursus. Ipsum tortor in aliquam imperdiet ut tristique maecenas.
                </p>
            </div>
            <div>
                <img src={aboutImg} alt='about image'/>
            </div>
        </section>  
    </div>
  )
}
