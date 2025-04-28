import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaExclamationCircle, FaTrash } from "react-icons/fa";

// Import categories from the data file to ensure consistency
import { categories, mainCategories } from "../../../data/links";

const ListingDetailsSection = ({ handleBack, handleNext, handleChangePlan, selectedPlan, methods }) => {
  const { register, formState: { errors }, handleSubmit, watch } = useFormContext();
  const [photoCount, setPhotoCount] = useState(0);
  const photos = watch("photos") || [];
  
  // Get max photo count based on selected plan
  const getMaxPhotoCount = () => {
    if (!selectedPlan) return 5; // Default to basic plan
    
    switch (selectedPlan.id) {
      case "basic":
        return 5;
      case "premium":
      case "featured":
        return 10;
      default:
        return 5;
    }
  };
  
  const maxPhotos = getMaxPhotoCount();
  
  useEffect(() => {
    setPhotoCount(photos.length);
  }, [photos]);
  
  // Load saved form data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('listingDetailsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach(key => {
        // Don't override the current photos if they exist
        if (key === 'photos' && photos.length > 0) return;
        methods.setValue(key, parsedData[key]);
      });
    }
  }, []);
  
  // Check if photo count exceeds the limit for the selected plan
  const isPhotoLimitExceeded = photoCount > maxPhotos;
  
  // Show warning if user has selected more photos than allowed by the plan
  const [showPhotoWarning, setShowPhotoWarning] = useState(false);
  
  useEffect(() => {
    if (isPhotoLimitExceeded) {
      setShowPhotoWarning(true);
    } else {
      setShowPhotoWarning(false);
    }
  }, [isPhotoLimitExceeded, photoCount, maxPhotos]);
  
  // Handle file size validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const [fileSizeError, setFileSizeError] = useState(null);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setFileSizeError(`${oversizedFiles.length} file(s) exceed the 5MB size limit and won't be uploaded.`);
      
      // Filter out oversized files
      const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length === 0) {
        return; // Don't proceed if no valid files
      }
      
      // Continue with valid files only
      methods.setValue("photos", [...photos, ...validFiles]);
    } else {
      setFileSizeError(null);
      methods.setValue("photos", [...photos, ...files]);
    }
  };
  
  // Handle individual photo removal
  const handleRemovePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    methods.setValue("photos", updatedPhotos);
  };
  
  const onSubmit = (data) => {
    // If photo limit is exceeded, trim the photos array to the maximum allowed
    if (isPhotoLimitExceeded) {
      const trimmedPhotos = photos.slice(0, maxPhotos);
      data.photos = trimmedPhotos;
      
      // Save the trimmed photos to the form
      methods.setValue("photos", trimmedPhotos);
    }
    
    // Save form data to localStorage to preserve it
    const formData = methods.getValues();
    localStorage.setItem('listingDetailsData', JSON.stringify(formData));
    
    handleNext();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Listing Details</h2>
          
          {/* Photo limit warning */}
          {showPhotoWarning && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
              <FaExclamationCircle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-700">
                  Your selected plan ({selectedPlan?.name}) allows a maximum of {maxPhotos} photos.
                  {photoCount - maxPhotos} photo(s) will be removed when you proceed.
                </p>
                <button 
                  onClick={() => setShowPhotoWarning(false)} 
                  className="text-xs text-amber-700 underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {/* File size error */}
          {fileSizeError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <FaExclamationCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-700">{fileSizeError}</p>
                <button 
                  onClick={() => setFileSizeError(null)} 
                  className="text-xs text-red-700 underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Photos ({photoCount}/{maxPhotos})
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                {...register("photos")}
              />
              <label
                htmlFor="photos"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </label>
            </div>
            
            {/* Photo Preview */}
            {photoCount > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from(photos).map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash size={12} />
                    </button>
                    <span className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-60 text-white px-1 py-0.5 rounded">
                      {(photo.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Listing Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Listing Title*
            </label>
            <input
              id="title"
              type="text"
              {...register("title", { required: "Title is required" })}
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0`}
              placeholder="Enter a descriptive title for your listing"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          {/* Category Selection */}
          <div className="mb-4">
            <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Main Category*
            </label>
            <select
              id="mainCategory"
              {...register("mainCategory", { required: "Main category is required" })}
              className={`w-full px-3 py-2 border ${errors.mainCategory ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0`}
            >
              <option value="">Select a main category</option>
              <option value="domestic">Domestic</option>
              <option value="event & entertainment">Event & Entertainment</option>
              <option value="trade">Trade</option>
              <option value="other">Other</option>
            </select>
            {errors.mainCategory && (
              <p className="mt-1 text-xs text-red-500">{errors.mainCategory.message}</p>
            )}
          </div>
          
          {/* Sub-Category Selection */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Specific Category*
            </label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0`}
              disabled={!methods.watch("mainCategory")}
            >
              <option value="">Select a specific category</option>
              {methods.watch("mainCategory") && categories[methods.watch("mainCategory")] && 
                categories[methods.watch("mainCategory")].map((cat, index) => (
                  <option key={index} value={cat.header}>
                    {cat.header}
                  </option>
                ))
              }
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          {/* Listing Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              rows="5"
              {...register("description", { 
                required: "Description is required",
                minLength: { value: 20, message: "Description must be at least 20 characters" }
              })}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0`}
              placeholder="Provide a detailed description of your listing"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 20 characters. Be detailed and highlight what makes your listing special.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md shadow transition duration-300"
            >
              <FaArrowLeft className="w-3 h-3" />
              Previous
            </button>
            <button
              type="button"
              onClick={handleChangePlan}
              className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md shadow transition duration-300"
            >
              Change Plan
            </button>
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-primaryA0 hover:bg-primaryB0 text-white px-4 py-2 rounded-md shadow transition duration-300"
          >
            Next Step
            <FaArrowRight className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
};

ListingDetailsSection.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleChangePlan: PropTypes.func.isRequired,
  selectedPlan: PropTypes.object,
  methods: PropTypes.object.isRequired,
};

export default ListingDetailsSection;
