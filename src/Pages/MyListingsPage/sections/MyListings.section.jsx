import React, { useState } from 'react';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MyListingCard from '../../../Components/Card/MyListingCard';
import useGetUserListings from '../../../utils/react-query-hooks/Listings/useGetUserListings';
import ErrorBoundary from '../../../Components/ErrorBoundary/ErrorBoundary';
import Pagination from '../../../Components/Pagination/Pagination';
import EmptyState from '../../../Components/EmptyState/EmptyState';

export default function MyListingsSection() {
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();
  
  const { data, isLoading, isError, error } = useGetUserListings({
    page, 
    limit: 12,
    status: selectedStatus
  });
  
  const handleAddListing = () => {
    navigate('/addList');
  };
  
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1); // Reset page when changing filters
  };
  
  const renderListings = () => {
    if (!data?.data?.listings || data.data.listings.length === 0) {
      return (
        <EmptyState 
          title="No listings found" 
          description={selectedStatus 
            ? `You don't have any ${selectedStatus} listings yet.` 
            : "You haven't created any listings yet."}
          actionText="Create a new listing"
          onAction={handleAddListing}
        />
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.listings.map((listing) => (
            <MyListingCard key={listing._id} card={listing} />
          ))}
        </div>
        
        {data.data.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data.data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </>
    );
  };
  
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your service listings
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <select
              className="appearance-none w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 bg-white"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">All listings</option>
              <option value="active">Active listings</option>
              <option value="inactive">Inactive listings</option>
              <option value="expired">Expired listings</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaFilter size={14} />
            </div>
          </div>
          
          <button
            onClick={handleAddListing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0 w-full sm:w-auto"
          >
            <FaPlus size={14} />
            <span>Add Listing</span>
          </button>
        </div>
      </div>
      
      <ErrorBoundary isLoading={isLoading} isError={isError} error={error}>
        {renderListings()}
      </ErrorBoundary>
    </section>
  );
}
