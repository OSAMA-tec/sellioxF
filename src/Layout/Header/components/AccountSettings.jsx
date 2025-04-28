import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { HiOutlineCreditCard } from "react-icons/hi";
import { FaRegBell, FaListUl, FaTicketAlt } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../../redux/slices/user.slice';
export default function AccountSettings() {
  const user = useSelector(state=>state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogOut = () => {
    dispatch(logOut());
    navigate("/")
  }
  
  return (
    <div className='bg-white rounded-lg shadow-xl overflow-hidden w-64'>
      {/* User info section */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img 
              src={`${user?.avatar}`} 
              alt='User avatar' 
              className='w-10 h-10 object-cover rounded-full bg-gray-100 border border-primaryA0'
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-700 font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 truncate max-w-[180px]">{user?.name}</span>
            <span className="text-xs text-gray-500 truncate max-w-[180px]">{user?.email}</span>
          </div>
        </div>
      </div>
      
      {/* Menu items */}
      <div className="p-2">
        <div className="mb-1">
          <span className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Account</span>
          <ul className='flex flex-col'>
            <li>
              <Link to="/account" className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                <span className="text-gray-500"><IoSettingsOutline size={18} /></span>
                <span className="text-gray-700">Account Settings</span>
              </Link>
            </li> 
            <li>
              <Link to="/account/payment" className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                <span className="text-gray-500"><HiOutlineCreditCard size={18} /></span>
                <span className="text-gray-700">Payment</span>
              </Link>
            </li> 
            <li> 
              <Link to="/account/notification" className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                <span className="text-gray-500"><FaRegBell size={16} /></span>
                <span className="text-gray-700">Notifications</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="my-1 border-t pt-1">
          <span className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Listings</span>
          <ul className='flex flex-col'>
            <li> 
              <Link to="/mylistings/mylistings" className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                <span className="text-gray-500"><FaListUl size={16} /></span>
                <span className="text-gray-700">My Listings</span>
              </Link>
            </li>
            <li> 
              <Link to="/mylistings" className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                <span className="text-gray-500"><CiBookmark size={18} /></span>
                <span className="text-gray-700">Saved Listings</span>
              </Link>
            </li>
            <li> 
              <Link to="/referral" className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                <span className="text-gray-500"><FaTicketAlt size={16} /></span>
                <span className="text-gray-700">Referral Program</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mt-1 border-t pt-1">
          <ul className='flex flex-col'>
            <li 
              onClick={handleLogOut}
              className='flex gap-2 items-center px-3 py-2 rounded-md hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors'
            > 
              <span className="text-gray-500"><RiLogoutCircleLine size={18} /></span>
              <span className="text-gray-700">Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
