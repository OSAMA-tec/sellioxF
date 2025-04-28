import React, { useState } from 'react'
import CardsContainer from '../../../Components/CardsContainer/CardsContainer'
import ErrorBoundary from '../../../Components/ErrorBoundary/ErrorBoundary';
import useGetUserSavedListings from '../../../utils/react-query-hooks/Listings/useGetUserSavedListings';
import EmptyState from '../../../Components/EmptyState/EmptyState';
import { FaRegBookmark } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function SavedListingsSection() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const {data, isLoading, isError, error} = useGetUserSavedListings({page});
  
  const handleBrowseListings = () => {
    navigate('/');
  };
  
  const renderSavedListings = () => {
    // Check if there are no saved listings
    if (!data?.data?.listings || data.data.listings.length === 0) {
      return (
        <EmptyState 
          title="No saved listings" 
          description="You haven't saved any listings yet. Browse the marketplace to find services you're interested in."
          icon={FaRegBookmark}
          actionText="Browse Listings"
          onAction={handleBrowseListings}
        />
      );
    }
    
    // If there are saved listings, display them
    return <CardsContainer cards={data?.data} setPage={setPage} />;
  };

  return (
    <section className='my-10 max-w-7xl mx-auto px-4 md:px-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Saved Listings</h1>
      </div>
      
      <ErrorBoundary isLoading={isLoading} isError={isError} error={error}>
        {renderSavedListings()}
      </ErrorBoundary>
    </section>
  )
}
