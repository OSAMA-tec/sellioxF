import React, { useState } from 'react'
import Dropdown from '../../../Components/Dropdown/Dropdown'
import { FaBars, FaListUl, FaTicketAlt } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import AccountSettings from '../components/AccountSettings'
import avatar from "../../../assets/images/avatar.png";
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import config from '../../../config';
import { RiLogoutCircleLine } from 'react-icons/ri'
export default function TopNav() {
    const user = useSelector(state => state.user.user);
    const apiURL = config.BACKEND_URL;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    return (
        <nav className='flex justify-between items-center px-3 py-3 md:py-4 lg:py-5 md:px-6 lg:px-10 mx-auto relative shadow-sm'>
            {/* Logo */}
            <div>
                <Link to="/">
                    <h1 className='text-xl md:text-2xl font-semibold hover:text-primaryA0 transition-colors'>Selliox</h1>
                </Link>
            </div>
            
            {/* Mobile quick actions - visible next to menu button */}
            <div className="flex items-center gap-2 md:hidden">
                {!user && (
                    <Link 
                        to="/auth/login" 
                        className="p-2 text-primaryA0 hover:bg-primaryA0/10 rounded-full transition-colors"
                        aria-label="Login"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>
                )}
                
                <Link 
                    to="/addList" 
                    className="p-2 text-primaryA0 hover:bg-primaryA0/10 rounded-full transition-colors"
                    aria-label="Create Listing"
                >
                    <IoMdAddCircleOutline size={22} />
                </Link>
                
                <Link 
                    to="/referral" 
                    className="p-2 text-primaryA0 hover:bg-primaryA0/10 rounded-full transition-colors"
                    aria-label="Referral Program"
                >
                    <FaTicketAlt size={18} />
                </Link>
                
                {/* Mobile menu button */}
                <button 
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors ml-1"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {mobileMenuOpen ? <IoMdClose size={24} /> : <FaBars size={24} />}
                </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-6'>
                <div className='flex gap-6 items-center'>
                    {!user &&
                        <>           
                            <Link to="/auth/login" className='hover:text-primaryA0 transition-colors font-medium'>Login</Link>
                            <Link to="/auth/register" className='hover:text-primaryA0 transition-colors font-medium'>Register</Link>
                        </>
                    }
                </div>
                <div className='flex items-center gap-4'>
                    <Link to="/referral" className='flex items-center gap-2 hover:text-primaryA0 transition-colors'>
                        <FaTicketAlt size={18}/>
                        <span className="font-medium">Referral</span>
                    </Link>
                    <Link to="/addList" className='flex items-center gap-2 hover:text-primaryA0 transition-colors'>
                        <IoMdAddCircleOutline size={20}/>
                        <span className="font-medium">Start Listing</span>
                    </Link>
                </div>

                {user &&
                    <div className='flex items-center gap-3 p-1 rounded-full border hover:border-primaryA0 transition-all'>
                        <Dropdown title={
                            <div className="flex items-center gap-2">
                                <FaBars className="text-gray-700" />
                                {user?.avatar && 
                                    <img 
                                        src={`${apiURL}/${user?.avatar}`} 
                                        alt='User avatar' 
                                        className='w-10 h-10 object-cover rounded-full ms-1 bg-gray-100'
                                    />
                                } 
                            </div>
                        } 
                        menuStyle={`bg-white shadow-lg rounded-lg py-2 mt-1`}>
                            <AccountSettings />
                        </Dropdown>
                    </div>
                }
            </div>
            
            {/* Mobile Navigation - overlaid menu */}
            <div 
                className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:hidden fixed top-[60px] left-0 right-0 bg-white shadow-lg z-50 flex-col py-4 px-6 gap-4 transition-all duration-300 border-t`}
                style={{maxHeight: mobileMenuOpen ? 'calc(100vh - 60px)' : '0', overflowY: 'auto'}}
            >
                {!user ? (
                    <div className='flex flex-col gap-4'>
                        <Link 
                            to="/auth/login" 
                            className='hover:text-primaryA0 py-3 block w-full text-center font-medium border rounded-lg hover:border-primaryA0 transition-colors' 
                            onClick={toggleMobileMenu}
                        > 
                            Login
                        </Link>
                        <Link 
                            to="/auth/register" 
                            className='hover:text-primaryA0 py-3 block w-full text-center font-medium border rounded-lg hover:border-primaryA0 transition-colors' 
                            onClick={toggleMobileMenu}
                        > 
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className='flex flex-col gap-4 items-center'>
                        <div className='flex justify-center mb-4'>
                            {user?.avatar ? (
                                <img 
                                    src={`${apiURL}/${user?.avatar}`} 
                                    alt='User avatar' 
                                    className='w-16 h-16 object-cover rounded-full bg-gray-100 border-2 border-primaryA0'
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-700 font-medium text-xl">
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-center font-medium text-lg mb-4">{user.name}</h3>
                        
                        <div className="w-full border-t mb-3"></div>
                        
                        <div className="grid grid-cols-1 gap-2">
                            <Link 
                                to="/account" 
                                className='flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium hover:border-primaryA0 hover:text-primaryA0 transition-colors' 
                                onClick={toggleMobileMenu}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                My Account
                            </Link>
                            <Link 
                                to="/mylistings" 
                                className='flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium hover:border-primaryA0 hover:text-primaryA0 transition-colors' 
                                onClick={toggleMobileMenu}
                            >
                                <FaListUl className="h-5 w-5" />
                                My Listings
                            </Link>
                            <Link 
                                to="/mylistings/mylistings" 
                                className='flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium hover:border-primaryA0 hover:text-primaryA0 transition-colors' 
                                onClick={toggleMobileMenu}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Saved Listings
                            </Link>
                        </div>
                    </div>
                )}
                
                <div className="w-full border-t my-1"></div>
                
                <div className='grid grid-cols-2 gap-3 w-full'>
                    <Link 
                        to="/referral" 
                        className='flex items-center gap-2 justify-center hover:bg-blue-600 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors' 
                        onClick={toggleMobileMenu}
                    >
                        <FaTicketAlt size={18}/>
                        <span>Referral</span>
                    </Link>
                    <Link 
                        to="/addList" 
                        className='flex items-center gap-2 justify-center hover:bg-primaryA0 bg-primaryA0/90 text-white py-3 px-4 rounded-lg font-medium transition-colors' 
                        onClick={toggleMobileMenu}
                    >
                        <IoMdAddCircleOutline size={20}/>
                        <span>Start Listing</span>
                    </Link>
                </div>
                
                {user && (
                    <button
                        onClick={() => {
                            handleLogOut();
                            toggleMobileMenu();
                        }}
                        className="mt-2 flex items-center justify-center gap-2 py-2 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <RiLogoutCircleLine size={18} />
                        <span>Logout</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
