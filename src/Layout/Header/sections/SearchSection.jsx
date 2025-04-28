import React, { useState } from 'react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import Dropdown from '../../../Components/Dropdown/Dropdown';
import BrowseMenu from '../../../Components/BrowseMenu/BrowseMenu';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTitle, setSearchListingNumber } from '../../../redux/slices/search.slice';

export default function SearchSection() {
  const searchCategory = useSelector((state) => state.search.category);
  const [queryText, setQueryText] = useState('');
  const dispatch = useDispatch();
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Check if the search query is a number (potential listing number)
    if (/^\d+$/.test(queryText)) {
      // If it's a number, search by listing number
      dispatch(setSearchListingNumber({ listingNumber: queryText }));
    } else {
      // Otherwise search by title
      dispatch(setSearchTitle({ title: queryText }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch md:items-center mb-4 px-3 md:px-6 gap-3 md:gap-0">
      <div className="w-full md:w-auto flex flex-col md:flex-row shadow-md rounded-lg md:rounded-xl overflow-hidden border">
        {/* Browse dropdown - Full width on mobile */}
        <div className="flex justify-center w-full md:w-auto border-b md:border-b-0 md:border-r">
          <Dropdown
            title={
              <div className="flex items-center justify-center gap-2 py-3 px-4 hover:text-primaryA0 w-full transition-colors">
                <span className="text-sm sm:text-base text-center truncate font-medium capitalize max-w-[180px] sm:max-w-none">
                  {searchCategory || 'Browse marketplace'}
                </span>
                <FaChevronDown className="text-gray-600 flex-shrink-0" />
              </div>
            }
            btnStyle="flex items-center justify-center w-full md:w-auto"
            menuStyle="w-full !left-0 !right-0 max-h-[50vh] md:max-h-[80vh] overflow-y-auto shadow-lg rounded-lg"
            dropdownStyle="!static w-full"
          >
            <BrowseMenu className="shadow-xl bg-white rounded-lg overflow-hidden" />
          </Dropdown>
        </div>
        
        {/* Search form - Full width on mobile */}
        <form
          className="flex items-center w-full px-2 sm:px-3 gap-2"
          onSubmit={handleSearch}
        >
          <div className="flex flex-1 w-full relative">
            <input
              placeholder="Search by listing title or #ID..."
              className="py-2.5 sm:py-3 px-3 flex-1 w-full focus:outline-primaryA0 text-sm sm:text-base rounded-md"
              value={queryText}
              onChange={(e) => {
                setQueryText(e.target.value);
              }}
              type="text"
              aria-label="Search input"
            />
          </div>
          <button 
            type="submit"
            className="p-2 sm:p-3 rounded-lg bg-primaryA0 hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0"
            aria-label="Search"
          >
            <FaSearch className="text-white" size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
