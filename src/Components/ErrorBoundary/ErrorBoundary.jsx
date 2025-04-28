import React from 'react'
import Spinner from '../Spinner/Spinner';
import EmptyState from '../EmptyState/EmptyState';
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const ErrorBoundary = React.memo(({children, isLoading, isError, error, retry}) => {
    if(isLoading) {
        return ( 
            <div className="w-full flex justify-center items-center p-8" role="status" aria-live="polite">
                <Spinner />
                <span className="sr-only">Loading content...</span>
            </div>
        );
    }
    
    if(isError) {
        // Check for specific error types
        if (error?.response?.status === 404 && error?.response?.data?.message?.includes('No listings')) {
            return (
                <EmptyState 
                    title="No Listings Found" 
                    description="There are no listings matching your search criteria."
                    icon={<FaSearch className="text-gray-400" size={32} />}
                    actionText={retry ? "Try Again" : null}
                    onAction={retry}
                />
            );
        }
        
        // Network error
        if (error?.message === 'Network Error') {
            return (
                <div className='flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg' role="alert">
                    <FaExclamationTriangle className="text-yellow-500 mb-3" size={32} />
                    <h3 className='text-xl font-medium text-gray-800 mb-2'>Connection Problem</h3>
                    <p className='text-gray-600 mb-4'>We're having trouble connecting to the server. Please check your internet connection.</p>
                    {retry && (
                        <button 
                            onClick={retry}
                            className="px-4 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            );
        }
        
        // Authorization error
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            return (
                <div className='flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg' role="alert">
                    <FaExclamationTriangle className="text-yellow-500 mb-3" size={32} />
                    <h3 className='text-xl font-medium text-gray-800 mb-2'>Authentication Required</h3>
                    <p className='text-gray-600'>You need to be logged in to access this content.</p>
                </div>
            );
        }
        
        // Default error
        return (
            <div className='flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg' role="alert">
                <FaExclamationTriangle className="text-red-500 mb-3" size={32} />
                <h3 className='text-xl font-medium text-gray-800 mb-2'>Something went wrong</h3>
                <p className='text-gray-600 mb-4'>{error?.response?.data?.message || error?.message || 'An unexpected error occurred'}</p>
                {retry && (
                    <button 
                        onClick={retry}
                        className="px-4 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }
    
    return <>{children}</>;
});

export default ErrorBoundary;