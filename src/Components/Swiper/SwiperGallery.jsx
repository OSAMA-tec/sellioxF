import React, { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './SwiperGallery.css'
import config from '../../config'
export default function SwiperGallery({ serviceImages = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState([]);
    const [imageError, setImageError] = useState(false);
    const apiURL = config.BACKEND_URL;

    // Track which images have loaded
    useEffect(() => {
        setImagesLoaded(new Array(serviceImages.length).fill(false));
    }, [serviceImages]);

    // Handle image loading status
    const handleImageLoad = (index) => {
        setImagesLoaded(prev => {
            const newLoaded = [...prev];
            newLoaded[index] = true;
            return newLoaded;
        });
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < serviceImages.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleSetImg = (index) => {
        setCurrentIndex(index);
    };

    const handleKeyDown = (e, index) => {
        // For thumbnails
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSetImg(index);
        }

        // For navigation buttons
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    const handleMainImageError = () => {
        setImageError(true);
    };

    // Get current image source or fallback
    const currentImage = serviceImages && serviceImages.length > 0
        ? `${apiURL}/${serviceImages[currentIndex]}`
        : `${apiURL}/no-image.png`;

    return (
        <div className='w-full mx-auto mb-4 sm:mb-6 flex flex-col items-center'>
            {/* Main image container with aspect ratio */}
            <div className='w-full relative rounded-lg overflow-hidden bg-gray-200' style={{ aspectRatio: '16/9' }}>
                {/* Loading state */}
                {!imagesLoaded[currentIndex] && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="w-10 h-10 border-4 border-primaryA0 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Main image */}
                <img
                    src={currentImage}
                    alt={`Gallery image ${currentIndex + 1}`}
                    className={`w-full h-full object-contain md:object-cover transition-opacity duration-300 ${imagesLoaded[currentIndex] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => handleImageLoad(currentIndex)}
                    onError={handleMainImageError}
                />

                {/* Navigation arrows on main image - only show if we have multiple images */}
                {serviceImages && serviceImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                            onClick={handlePrev}
                            onKeyDown={(e) => handleKeyDown(e)}
                            disabled={currentIndex === 0}
                            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                            aria-label="Previous image"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={handleNext}
                            onKeyDown={(e) => handleKeyDown(e)}
                            disabled={currentIndex === serviceImages.length - 1}
                            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                            aria-label="Next image"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}

                {/* Image counter */}
                {serviceImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                        {currentIndex + 1} / {serviceImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {serviceImages.length > 1 && (
                <div className='mt-4 w-full'>
                    <div className='flex space-x-2 overflow-x-auto py-2 px-1 scrollbar-hide'>
                        {serviceImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => handleSetImg(i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className={`flex-shrink-0 relative rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primaryA0 transition-all ${currentIndex === i
                                        ? 'ring-2 ring-primaryA0'
                                        : 'opacity-70 hover:opacity-100'
                                    }`}
                                style={{ width: '80px', height: '60px' }}
                                aria-label={`View image ${i + 1}`}
                                aria-current={currentIndex === i ? 'true' : 'false'}
                            >
                                <img
                                    src={`${apiURL}/${img}`}
                                    alt={`Thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    onLoad={() => handleImageLoad(i)}
                                    onError={(e) => {
                                        e.target.src = `${apiURL}/no-image.png`;
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
