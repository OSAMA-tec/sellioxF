import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SwiperComponent from "../../Components/Swiper/Swiper";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import CardsContainer from "../../Components/CardsContainer/CardsContainer";
import useGetAllListings from "../../utils/react-query-hooks/Listings/useGetAllListings";
import { allCategories } from "../../data/links";
import { setSearchCategory, setSearchSubCategory, setSearchTitle, setSearchListingNumber } from "../../redux/slices/search.slice";
import { FaFilter, FaTimes, FaMapMarkerAlt, FaChevronDown, FaSearch } from "react-icons/fa";
import { ausRegions, nzRegions } from "../../data/locations";

export default function Homepage() {
  const [page, setPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const searchTitle = useSelector((state) => state.search.title);
  const searchCategory = useSelector((state) => state.search.category);
  const searchListingNumber = useSelector((state) => state.search.listingNumber);

  // Handle clicks outside the location dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    }
    
    // Add event listener only when dropdown is open
    if (showLocationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationDropdown]);

  // Fetching the listings
  const { data, isLoading, isError, error } = useGetAllListings({
    page: page,
    category: searchCategory,
    title: searchTitle,
    listingNumber: searchListingNumber,
    limit: 20,
    country: selectedCountry,
    region: selectedRegion,
    district: selectedDistrict,
  });
  
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedRegion("");
    setSelectedDistrict("");
    
    if (country === "New Zealand") {
      setRegions(Object.keys(nzRegions));
      setDistricts([]);
    } else if (country === "Australia") {
      setRegions(Object.keys(ausRegions));
      setDistricts([]);
    } else {
      setRegions([]);
      setDistricts([]);
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedDistrict("");
    
    if (selectedCountry === "New Zealand") {
      setDistricts(nzRegions[region] || []);
    } else if (selectedCountry === "Australia") {
      setDistricts(ausRegions[region] || []);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleClear = () => {
    setSelectedCountry("");
    setSelectedRegion("");
    setSelectedDistrict("");
    setDistricts([]);
    setRegions([]);
    if (searchTitle) {
      dispatch(setSearchTitle({ title: '' }));
    }
    if (searchListingNumber) {
      dispatch(setSearchListingNumber({ listingNumber: '' }));
    }
    if (searchCategory) {
      dispatch(setSearchSubCategory({category:'', subCategory:''}));
    }
    setShowFilters(false);
    setShowLocationDropdown(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const toggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTitle || searchCategory || searchListingNumber || selectedCountry || selectedRegion || selectedDistrict;
  const hasLocationFilters = selectedCountry || selectedRegion || selectedDistrict;

  // Format location for display in the filter button
  const getLocationDisplay = () => {
    if (!selectedCountry) return "Location: Any";
    
    let display = selectedCountry;
    if (selectedRegion) display += ` › ${selectedRegion}`;
    if (selectedDistrict) display += ` › ${selectedDistrict}`;
    
    return display;
  };

  // Handle keyboard events for accessibility
  const handleLocationKeyDown = (e) => {
    // Toggle dropdown on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLocationDropdown();
    }
    // Close dropdown on Escape
    else if (e.key === 'Escape' && showLocationDropdown) {
      setShowLocationDropdown(false);
    }
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Categories Section */}
      <section className="categories-area mb-4 pt-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-2 px-4 md:px-8 pb-4">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">Top Categories</h2>
          </div>
          <SwiperComponent slides={allCategories} />
        </div>
      </section>
      
      {/* Listings Section */}
      <section className="w-full px-6 md:px-10 flex flex-col capitalize gap-3 my-3 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          {/* Search and filter tools */}
          <div className="flex flex-row items-center justify-between mb-4 w-full gap-3">
            {/* Left side: Results Count */}
            <div className="flex items-center text-sm md:text-base text-gray-700">
              <span className="font-medium">
                {data?.data?.listings?.length || 0}
              </span> 
              <span className="mx-1">of</span>
              <span className="font-medium">
                {data?.data?.totalListings || 0}
              </span>
              <span className="ml-1">active listings</span>
              {hasActiveFilters && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">Filtered</span>
              )}
            </div>
            
            {/* Right side: Location filter dropdown */}
            <div className="relative ml-auto" ref={locationDropdownRef}>
              <button 
                onClick={toggleLocationDropdown}
                onKeyDown={handleLocationKeyDown}
                className={`flex items-center justify-between gap-2 px-4 py-2 rounded-lg border ${hasLocationFilters ? 'border-primaryA0 text-primaryA0 bg-primaryA0/5' : 'border-gray-300 text-gray-700'} hover:border-primaryA0 transition-colors min-w-[200px] md:min-w-[250px]`}
                aria-expanded={showLocationDropdown}
                aria-haspopup="true"
                tabIndex="0"
                aria-label="Location filter"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FaMapMarkerAlt size={14} />
                  <span className="truncate text-sm font-medium">{getLocationDisplay()}</span>
                </div>
                <FaChevronDown size={12} className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Location dropdown */}
              {showLocationDropdown && (
                <div 
                  className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 right-0 min-w-[280px] md:min-w-[350px] animate-fadeIn transition-all transform-gpu origin-top"
                  role="dialog"
                  aria-label="Location filters"
                >
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2" id="location-filter-title">Location</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="country-select" className="block text-xs text-gray-600 mb-1">Country</label>
                          <select 
                            id="country-select"
                            className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0" 
                            onChange={handleCountryChange} 
                            value={selectedCountry}
                            autoFocus
                          >
                            <option value="">Any country</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="region-select" className="block text-xs text-gray-600 mb-1">Region</label>
                          <select 
                            id="region-select"
                            className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 ${!regions.length ? 'bg-gray-50 text-gray-500' : 'border-gray-300'}`}
                            onChange={handleRegionChange} 
                            value={selectedRegion} 
                            disabled={!regions.length}
                          >
                            <option value="">{regions.length ? 'Any region' : 'Select a country first'}</option>
                            {regions?.map((region) => (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="district-select" className="block text-xs text-gray-600 mb-1">District/City</label>
                          <select
                            id="district-select"
                            className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 ${!districts.length ? 'bg-gray-50 text-gray-500' : 'border-gray-300'}`}
                            onChange={handleDistrictChange}
                            value={selectedDistrict}
                            disabled={!districts.length}
                          >
                            <option value="">{districts.length ? 'Any district/city' : 'Select a region first'}</option>
                            {districts?.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t">
                      <button 
                        onClick={() => {
                          setSelectedCountry("");
                          setSelectedRegion("");
                          setSelectedDistrict("");
                          setDistricts([]);
                          setRegions([]);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primaryA0 rounded px-2"
                        disabled={!hasLocationFilters}
                        aria-label="Reset location filters"
                      >
                        Reset location
                      </button>
                      
                      <button 
                        onClick={toggleLocationDropdown}
                        className="px-4 py-1 text-sm bg-primaryA0 text-white rounded hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:ring-offset-2"
                        aria-label="Apply location filters"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            


            {/* Clear all filters button */}
            {hasActiveFilters && (
              <button 
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Clear all filters"
              >
                <FaTimes size={12} />
                <span className="text-sm">Clear all</span>
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-start gap-2 mb-4">

            
            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {searchCategory && (
                  <span className="bg-primaryA0/10 text-primaryA0 px-3 py-1 rounded-full flex items-center">
                    {searchCategory}
                  </span>
                )}
                {searchTitle && (
                  <span className="bg-primaryA0/10 text-primaryA0 px-3 py-1 rounded-full flex items-center">
                    "{searchTitle}"
                  </span>
                )}
                {searchListingNumber && (
                  <span className="bg-primaryA0/10 text-primaryA0 px-3 py-1 rounded-full flex items-center">
                    #ID: {searchListingNumber}
                  </span>
                )}
                {selectedCountry && (
                  <span className="bg-primaryA0/10 text-primaryA0 px-3 py-1 rounded-full flex items-center">
                    <FaMapMarkerAlt className="mr-1" size={12} />
                    {selectedCountry}
                    {selectedRegion && ` › ${selectedRegion}`}
                    {selectedDistrict && ` › ${selectedDistrict}`}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Listings grid */}
        <ErrorBoundary isLoading={isLoading} isError={isError} error={error}>
          <CardsContainer cards={data?.data} setPage={setPage} />
        </ErrorBoundary>
      </section>
    </div>
  );
}
