import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaUpload, FaTrash, FaExclamationCircle } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

const Photos = ({ handleBack, handleNext, selectedPlan }) => {
  const { register, formState: { errors }, handleSubmit, setValue, watch } = useFormContext();
  const [photos, setPhotos] = useState(watch("photos") || []);
  const [uploading, setUploading] = useState(false);

  const onSubmit = (data) => {
    setValue("photos", photos);
    handleNext();
  };

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
  const remainingPhotos = maxPhotos - photos.length;
  const canAddMorePhotos = remainingPhotos > 0;
  
  const onDrop = useCallback((acceptedFiles) => {
    if (!canAddMorePhotos) {
      // Show an alert if the user tries to add more photos than allowed
      alert(`Your ${selectedPlan?.name || 'Basic'} plan allows a maximum of ${maxPhotos} photos. Please upgrade your plan to add more photos.`);
      return;
    }
    
    // Limit the number of files to the remaining allowed count
    const filesToAdd = acceptedFiles.slice(0, remainingPhotos);
    
    if (filesToAdd.length === 0) return;
    
    setUploading(true);
    // Convert files to array of objects with preview URLs
    const newFiles = filesToAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      name: file.name,
      size: file.size,
    }));

    // Simulate upload process
    setTimeout(() => {
      setPhotos(prevPhotos => [
        ...prevPhotos,
        ...newFiles.map(file => ({
          ...file,
          uploading: false,
        }))
      ]);
      setUploading(false);
    }, 1500);
  }, [photos.length, maxPhotos, canAddMorePhotos, selectedPlan]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: true
  });

  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    // Release object URL to avoid memory leaks
    if (updatedPhotos[index].preview) {
      URL.revokeObjectURL(updatedPhotos[index].preview);
    }
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Upload Photos</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload high-quality photos of your listing. Good photos significantly increase interest from potential visitors.
          </p>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <FaExclamationCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                Your <span className="font-medium">{selectedPlan?.name || 'Basic'}</span> plan allows up to <span className="font-medium">{maxPhotos}</span> photos.
                {remainingPhotos > 0 ? (
                  <span> You can add <span className="font-medium">{remainingPhotos}</span> more {remainingPhotos === 1 ? 'photo' : 'photos'}.</span>
                ) : (
                  <span> You've reached your photo limit.</span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Dropzone for photo upload */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-primaryA0 bg-primaryA0/5' : 'border-gray-300 hover:border-primaryA0 hover:bg-gray-50'} ${!canAddMorePhotos ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={!canAddMorePhotos} />
          <div className="flex flex-col items-center">
            <div className="mb-4 p-4 bg-primaryA0/10 rounded-full">
              <FaUpload className="text-primaryA0 text-2xl" />
            </div>
            <p className="text-base font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              or <span className="text-primaryA0 font-medium">browse files</span>
            </p>
            <p className="text-xs text-gray-500">
              Max {maxPhotos} photos, 5MB per photo. JPEG, PNG, GIF accepted.
            </p>
            {!canAddMorePhotos && (
              <p className="text-xs text-red-500 mt-3 font-medium">
                You've reached your photo limit. Remove some photos to add new ones.
              </p>
            )}
          </div>
        </div>

        {uploading && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
            <p className="text-sm">Uploading files... Please wait.</p>
          </div>
        )}
        
        {/* Photo preview grid */}
        {photos.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium text-gray-700">Uploaded Photos</h3>
              <span className="text-sm bg-primaryA0/10 text-primaryA0 font-medium px-3 py-1 rounded-full">
                {photos.length}/{maxPhotos}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-primaryA0/50">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                    <img
                      src={photo.preview}
                      alt={`Listing photo ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                    {photo.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    title="Remove photo"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft size={14} />
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primaryA0 text-white rounded-md hover:bg-primaryA0/90 transition-colors flex items-center gap-2"
          >
            Next
            <FaArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );
};

Photos.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  selectedPlan: PropTypes.object
};

export default Photos;