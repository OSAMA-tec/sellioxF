import React from 'react'
import Card from '../Card/Card'
import Pagination from '../Pagination/Pagination';
import { FaListUl } from 'react-icons/fa';

export default function CardsContainer({cards={},setPage}) {
  const {listings, currentPage, totalPages, totalListings} = cards;
  const listingsCount = listings?.length || 0;
  const totalCount = totalListings || 0;
  
  return (
    <div className='w-full flex flex-col gap-6'>
      {/* Listings count display */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="bg-white shadow-sm border rounded-lg px-4 py-2 flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <div className="flex items-center gap-2 text-primaryA0">
            <FaListUl className="text-primaryA0" />
            <span className="font-semibold text-lg">{listingsCount} of {totalCount}</span>
          </div>
          <span className="text-gray-600 text-sm sm:text-base">Active Listings</span>
        </div>
      </div>
      
      {/* Cards container */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mx-auto px-1'>
        {listings?.map((listing, i) => {
          return <Card key={i} card={listing}/>
        })}
      </div>
      
      {/* Pagination numbers */}
      <div className='w-full flex justify-center'>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}
