import React, { useState, useEffect } from "react";
import { IoAddCircleOutline, IoTrashOutline, IoImagesOutline } from "react-icons/io5";
import handleFilesChange from "../../../utils/helperFunctions/handleFilesChange";
import useGetPlans from "../../../utils/react-query-hooks/Plans/useGetPlans";
import ErrorBoundary from "../../../Components/ErrorBoundary/ErrorBoundary";
import { mainCategories, getLinksByHeader } from "../../../data/links";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function ServiceFormSection({ setValue, register, getValues, errors, setFormStep, maxImages, trigger, setMaxImages }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  // Initialize state from form values when component mounts
  useEffect(() => {
    const formValues = getValues();
    
    // Restore selected category
    if (formValues.serviceCategory) {
      setSelectedCategory(formValues.serviceCategory);
      setSubCategories(getLinksByHeader(formValues.serviceCategory));
    }
    
    // Restore selected plan
    if (formValues.servicePlan) {
      setSelectedPlan(formValues.servicePlan);
      
      // Look up the plan from the fetched data when it's available
      if (data?.data) {
        const plan = data.data.find(p => p._id === formValues.servicePlan);
        if (plan) {
          handleSelectedPlan(plan.planType);
        }
      }
    }
    
    // Restore image previews
    if (formValues.serviceImagePreviews && Array.isArray(formValues.serviceImagePreviews)) {
      setSelectedFiles(formValues.serviceImagePreviews);
    }
  }, [getValues]);
  
  // Effect to handle plan selection when data is loaded
  useEffect(() => {
    if (data?.data && selectedPlan) {
      const plan = data.data.find(p => p._id === selectedPlan);
      if (plan) {
        handleSelectedPlan(plan.planType);
      }
    }
  }, [data, selectedPlan]);

  //helper function
  const handleBack = () => {
    setFormStep((prevStep) => prevStep - 1);
  };
  
  const handleNextStep = async () => {
    const isValid = await trigger(["servicePlan", "serviceImages", "serviceTitle", "price", "serviceCategory", "serviceDescription"]);
    if (isValid) {
      setFormStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleSelectCategory = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSubCategories(getLinksByHeader(category));
  };
  
  const handleRemoveImages = () => {
    setSelectedFiles([]);
    errors.serviceImages = null;
    setValue("serviceImages", []);
    setValue("serviceImagePreviews", []);
  };

  const handleRemoveSingleImage = (index) => {
    // Remove from preview
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    setValue("serviceImagePreviews", newSelectedFiles);
    
    // Remove from form values
    const currentImages = getValues("serviceImages") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    setValue("serviceImages", newImages);
  };

  const handleSelectedPlan = (plan) => {
    // Set photo limits based on plan type
    if (plan === "premium" || plan === "featured") {
      setMaxImages(10);
    } else {
      setMaxImages(5);
    }
    
    // Track all plan features to store with the listing
    const planFeatures = {
      photoLimit: plan === "premium" || plan === "featured" ? 10 : 5,
      searchRanking: plan === "premium" ? "higher" : (plan === "featured" ? "top" : "standard"),
      isFeatured: plan === "featured",
      maxListings: plan === "premium" ? 5 : (plan === "featured" ? 10 : 1),
      highlightedListing: plan === "premium" || plan === "featured",
      customBadge: plan === "featured",
      planType: plan
    };
    
    // Store plan features in form data
    setValue("planFeatures", planFeatures);
  };
  
  // Custom file change handler that preserves preview URLs
  const handleImageFilesChange = (e) => {
    handleFilesChange(e, setSelectedFiles, setValue, getValues, maxImages);
    
    // Store preview URLs for persistence when navigating back
    setTimeout(() => {
      // We use a timeout to ensure selectedFiles is updated
      const previewUrls = [...selectedFiles];
      setValue("serviceImagePreviews", previewUrls);
    }, 100);
  };
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event object similar to onChange event
      const fileInputEvent = {
        target: {
          files: e.dataTransfer.files
        }
      };
      handleImageFilesChange(fileInputEvent);
    }
  };
  
  const { data, isLoading, isError, error } = useGetPlans();
  
  return (
    <div>
      <section className="flex justify-center px-4 md:px-10 lg:px-20 py-8">
        <div className="max-w-screen-lg w-full">
          <h3 className="mb-6 md:mb-10 text-xl md:text-2xl font-semibold">Choose Your Plan</h3>
          <ErrorBoundary isLoading={isLoading} isError={isError} error={error}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data?.data?.map((plan) => {
                const isSelected = getValues("servicePlan") === plan._id;
                const isPremium = plan.planType.toLowerCase() === "premium";
                const isFeatured = plan.planType.toLowerCase() === "featured";
                
                // Determine card style based on plan type
                const cardStyle = isPremium 
                  ? "border-purple-500 shadow-purple-200" 
                  : isFeatured 
                    ? "border-amber-500 shadow-amber-200" 
                    : "border-gray-300";
                
                const headerStyle = isPremium 
                  ? "bg-purple-500 text-white" 
                  : isFeatured 
                    ? "bg-amber-500 text-white" 
                    : "bg-gray-100 text-gray-800";
                
                return (
                  <div 
                    key={plan._id}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${cardStyle} ${isSelected ? 'ring-2 ring-primaryA0 shadow-lg scale-[1.02]' : 'hover:shadow-md'}`}
                    onClick={() => {
                      handleSelectedPlan(plan.planType);
                      setSelectedPlan(plan._id);
                      setValue("servicePlan", plan._id);
                    }}
                  >
                    {/* Plan Badge */}
                    {(isPremium || isFeatured) && (
                      <div className="absolute top-0 right-0 bg-white px-3 py-1 rounded-bl-lg shadow-sm z-10 transform translate-y-0 text-xs font-semibold">
                        {isPremium ? "BEST VALUE" : "POPULAR"}
                      </div>
                    )}
                    
                    {/* Plan Header */}
                    <div className={`px-4 py-5 ${headerStyle}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="plan"
                            value={plan._id}
                            checked={isSelected}
                            onChange={() => {}}
                            className="h-5 w-5 accent-primaryA0"
                            {...register("servicePlan")}
                          />
                          <h4 className="text-lg md:text-xl font-bold">{plan.planType}</h4>
                        </div>
                        <span className="text-sm font-normal">
                          {isPremium || isFeatured ? "Recommended" : ""}
                        </span>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl md:text-3xl font-bold">${plan.planPrice}</span>
                        <span className="text-sm">/month</span>
                      </div>
                    </div>
                    
                    {/* Plan Features */}
                    <div className="p-4 bg-white">
                      <h5 className="font-medium text-gray-700 mb-3">Features:</h5>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => {
                          // Enhanced feature display with additional details
                          
                          // Check if this is a video feature
                          if (feature.toLowerCase().includes("video content")) {
                            return null; // Skip video features
                          }
                          
                          // Check if this is a listings count feature
                          if (feature.toLowerCase().includes("concurrent listings")) {
                            return (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-500 flex-shrink-0 mt-0.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                <span className="text-sm text-gray-700 font-medium">
                                  {feature}
                                  <span className="block text-xs text-gray-500 mt-1">Post multiple listings simultaneously</span>
                                </span>
                              </li>
                            );
                          }
                          
                          // Check if this is a highlighted listing feature
                          if (feature.toLowerCase().includes("highlighted listing")) {
                            return (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-500 flex-shrink-0 mt-0.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                <span className="text-sm text-gray-700 font-medium">
                                  {feature}
                                  <span className="block text-xs text-gray-500 mt-1">Stand out with visual enhancements</span>
                                </span>
                              </li>
                            );
                          }
                          
                          // Use existing specialized handling for other features
                          
                          // Rest of existing feature rendering code
                          return (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 flex-shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          );
                        })}
                      </ul>
                      
                      <button 
                        type="button"
                        className={`w-full mt-6 py-3 rounded-md transition-colors ${
                          isSelected 
                            ? 'bg-primaryA0 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          handleSelectedPlan(plan.planType);
                          setSelectedPlan(plan._id);
                          setValue("servicePlan", plan._id);
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.servicePlan && (
              <p className="text-red-500 mt-4 text-center">{errors.servicePlan.message}</p>
            )}
          </ErrorBoundary>
          {errors.selectedPlan && <p className="text-red-500 mt-4 text-center">{errors.selectedPlan.message}</p>}
        </div>
      </section>
      <section className="flex flex-col py-6 md:py-10 capitalize items-center">
        <div className="max-w-screen-lg w-full">
          <div className="w-full flex flex-col mx-auto gap-4 px-4">
            <div className="bg-white shadow-lg rounded-lg">
              <h4 className="py-4 px-5 text-lg font-semibold">Service Details</h4>
              <hr className="border-2" />
              <div className="py-6 px-4 flex flex-col gap-5">
                {/* Image upload section */}
                <div className="w-full flex flex-col">
                  <div className="mb-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Active Plan Benefits:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>
                          <strong>Image Limit:</strong> Up to {maxImages} photos allowed
                        </span>
                      </li>
                      {getValues("planFeatures") && (
                        <>
                          <li className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>
                              <strong>Listing Visibility:</strong> {getValues("planFeatures").searchRanking === "top" 
                                ? "Top placement in search results" 
                                : getValues("planFeatures").searchRanking === "higher" 
                                  ? "Higher ranking than standard listings" 
                                  : "Standard visibility in search results"}
                            </span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>
                              <strong>Concurrent Listings:</strong> Up to {getValues("planFeatures").maxListings} {getValues("planFeatures").maxListings === 1 ? 'listing' : 'listings'} at a time
                            </span>
                          </li>
                          {getValues("planFeatures").isFeatured && (
                            <li className="flex items-center gap-2 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>
                                <strong>Featured Status:</strong> Your listing will be featured at the top of the homepage
                              </span>
                            </li>
                          )}
                          {getValues("planFeatures").highlightedListing && (
                            <li className="flex items-center gap-2 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>
                                <strong>Visual Enhancement:</strong> Your listing will stand out with special styling
                              </span>
                            </li>
                          )}
                          {getValues("planFeatures").customBadge && (
                            <li className="flex items-center gap-2 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>
                                <strong>Custom Badge:</strong> Premium seller badge displayed on your profile
                              </span>
                            </li>
                          )}
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div 
                    className={`relative w-full min-h-[160px] border-2 ${dragActive ? 'border-primaryA0 bg-primaryA0/5' : 'border-dashed'} rounded-lg flex flex-col gap-3 justify-center items-center text-gray-600 hover:cursor-pointer transition-all`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      className="hidden"
                      multiple
                      {...register("serviceImages")}
                      onChange={handleImageFilesChange}
                    />
                    <label
                      htmlFor="images"
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
                    >
                      <IoImagesOutline size={40} className="text-primaryA0" />
                      <span className="mt-2 font-medium">Add Service Images</span>
                      <span className="text-sm text-gray-500 mt-1">
                        Drag & drop or click to browse
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Max {maxImages} images, up to 5MB each
                      </span>
                    </label>
                  </div>
                  
                  {Array.isArray(errors.serviceImages) && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      {errors.serviceImages?.map((error, index) => (
                        <p key={index} className="text-red-600 text-sm">
                          <span>{error.message}</span>
                        </p>
                      ))}
                    </div>
                  )}
                  {!Array.isArray(errors.serviceImages) && errors.serviceImages && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">
                        <span>{errors.serviceImages.message}</span>
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Selected images preview */}
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium">Preview ({selectedFiles.length}/{maxImages} images)</h5>
                      <button 
                        onClick={handleRemoveImages} 
                        type="button" 
                        className="text-red-600 hover:text-red-700 py-1 px-3 text-sm flex items-center gap-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <IoTrashOutline size={16} />
                        <span>Remove All</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {selectedFiles.map((src, index) => {
                        const currentFile = getValues("serviceImages")?.[index];
                        const fileSize = currentFile ? formatFileSize(currentFile.size) : '';
                        
                        return (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={src} 
                                className="w-full h-full object-cover" 
                                alt={`Selected image ${index + 1}`} 
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSingleImage(index)}
                              className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-70 p-1.5 rounded-full text-white transition-all"
                              title="Remove image"
                            >
                              <IoTrashOutline size={14} />
                            </button>
                            {fileSize && (
                              <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs py-0.5 px-2 rounded-sm">
                                {fileSize}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="font-semibold">
                    Service Title
                  </label>
                  <input 
                    type="text" 
                    id="title" 
                    className="border rounded-lg py-2 px-3 focus:outline-primaryA0 focus:border-primaryA0" 
                    {...register("serviceTitle")} 
                  />
                  {errors.serviceTitle && <p className="text-red-500 text-sm">{errors.serviceTitle.message}</p>}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="category" className="font-semibold">
                    Service Category
                  </label>
                  <select
                    id="category"
                    className="border rounded-lg py-2 px-3 capitalize focus:outline-primaryA0 focus:border-primaryA0"
                    {...register("serviceCategory")}
                    onChange={(e) => handleSelectCategory(e)}
                    value={selectedCategory || ""}
                  >
                    <option value="" disabled>
                      Choose a category
                    </option>
                    {mainCategories.map((c, i) => {
                      return (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      );
                    })}
                  </select>
                  {errors.serviceCategory && <p className="text-red-500 text-sm">{errors.serviceCategory.message}</p>}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="font-semibold">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    id="description"
                    name="description"
                    className="border rounded-lg py-2 px-3 focus:outline-primaryA0 focus:border-primaryA0"
                    {...register("serviceDescription")}
                    placeholder="Describe your service in detail..."
                  />
                  {errors.serviceDescription && <p className="text-red-500 text-sm">{errors.serviceDescription.message}</p>}
                </div>
              </div>
            </div>
            <div className="mx-auto flex gap-4 mt-4">
              <button 
                className="btn-secondary py-2 px-5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" 
                onClick={handleBack} 
                type="button"
              >
                Back
              </button>
              <button 
                className="btn-primary py-2 px-5 rounded-lg bg-primaryA0 text-white hover:bg-primaryA0/90 transition-colors" 
                type="button" 
                onClick={handleNextStep}
              >
                Go to Payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
