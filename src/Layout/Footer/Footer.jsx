import React from 'react'
import BrowseMenu from '../../Components/BrowseMenu/BrowseMenu'
import { FaFacebookF } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Footer() {
  const user = useSelector(state=>state.user.user);
  return (
    <footer className='mt-auto bg-inputAccent1 py-3 w-full capitalize'>
      <div className='max-w-screen-lg mx-auto flex justify-between py-3 px-4'>
        <div><h6 className='text-2xl'>Selliox</h6></div>
{/*         <div className='flex gap-6 items-center'>
          {
            !user ?
            <>           
              <Link to="/auth/login" className='hover:text-primaryA0'> login</Link>
              <Link to="/auth/register" className='hover:text-primaryA0'> register</Link>
            </>
            :
            <Link to="/addList" className='hover:text-primaryA0'> start listing</Link>
          }
          
        </div> */}
      </div>
      <hr/>
      <BrowseMenu className={`py-2`}/>
      <hr/>
      <div className='w-full text-grayAccent1'>
        <div className='max-w-screen-lg flex flex-col md:flex-row justify-around py-3 mx-auto '>
        <div>© {new Date().getFullYear()} Marketpalce</div>
        <div className='flex gap-3 justify-between'>
          {/* <Link to={"/about"}>about us</Link> */}
          <Link to={"/privacy"}>privacy policy</Link>
          <Link to={"/terms"}>term & condition</Link>
          <Link to={"/contact"}>contact us</Link>
        </div>
        <div className='flex gap-3 justify-around'>
          <span><FaFacebookF /></span>
          <span><BsTwitterX /></span>
          <span><FaSquareInstagram /></span>
          <span><FaLinkedin /></span>
        </div>
        </div>
        
      </div>
    </footer>
  )
}
