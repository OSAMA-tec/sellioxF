import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa";
import { nzRegions, ausRegions } from "../../../data/locations";

const Listing = ({ methods, handleNext }) => {
  const { register, formState: { errors }, handleSubmit, watch } = useFormContext();
  const [defaultLogoColor, setDefaultLogoColor] = useState('#6663FD'); // Default primary color
  const businessName = watch("businessName") || "";
  
  // Generate a random color for the default logo
  useEffect(() => {
    // Only generate a new color if we don't already have one saved
    if (!methods.getValues("defaultLogoColor")) {
      const colors = [
        '#4F46E5', // Indigo
        '#7C3AED', // Violet
        '#EC4899', // Pink
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#6366F1', // Indigo
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#F43F5E', // Rose
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setDefaultLogoColor(randomColor);
      methods.setValue("defaultLogoColor", randomColor);
    } else {
      setDefaultLogoColor(methods.getValues("defaultLogoColor"));
    }
  }, [methods]);

  // Get the first letter of the business name for the default logo
  const getBusinessInitial = () => {
    if (businessName && businessName.length > 0) {
      return businessName.charAt(0).toUpperCase();
    }
    return "B";
  };

  const onSubmit = (data) => {
    // If no logo was uploaded, ensure we save the default logo color
    if (!data.logo) {
      methods.setValue("defaultLogoColor", defaultLogoColor);
    }
    handleNext();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Business Details
          </h2>
          <div className="mb-6">
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
              Business Logo <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              If you don't upload a logo, we'll generate one using the first letter of your business name.
            </p>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {methods.watch("logo") ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={methods.watch("logo")?.[0] instanceof File ? URL.createObjectURL(methods.watch("logo")[0]) : ""}
                      alt="Business logo preview"
                      className="max-h-28 max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => methods.setValue("logo", null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : businessName ? (
                  <div className="flex flex-col items-center justify-center">
                    {/* Default logo with first letter of business name */}
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2"
                      style={{ backgroundColor: defaultLogoColor }}
                    >
                      {getBusinessInitial()}
                    </div>
                    <p className="text-sm text-gray-600">Default logo generated</p>
                    <p className="text-xs text-gray-500 mt-1">Upload a custom logo instead</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                    <p className="text-xs text-gray-500 mt-1">Or enter a business name to generate a default logo</p>
                  </div>
                )}
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("logo")}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                id="businessName"
                type="text"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                  errors.businessName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your business name"
                {...register("businessName", {
                  required: "Business name is required",
                })}
              />
              {errors.businessName && (
                <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>
              )}

            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email Address *
              </label>
              <input
                id="businessEmail"
                type="email"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                  errors.businessEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your business email"
                {...register("businessEmail", {
                  required: "Business email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.businessEmail && (
                <p className="mt-1 text-xs text-red-500">{errors.businessEmail.message}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Business Location *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  id="country"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("country", {
                    required: "Country is required",
                  })}
                >
                  <option value="">Select Country</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Australia">Australia</option>
                </select>
                
                <select
                  id="region"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                    errors.region ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("region", {
                    required: "Region is required",
                  })}
                >
                  <option value="">Select Region</option>
                  {methods.watch("country") === "New Zealand" ? (
                    Object.keys(nzRegions).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))
                  ) : methods.watch("country") === "Australia" ? (
                    Object.keys(ausRegions).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))
                  ) : null}
                </select>
                
                <select
                  id="district"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("district", {
                    required: "District is required",
                  })}
                  disabled={!methods.watch("region")}
                >
                  <option value="">Select District</option>
                  {methods.watch("country") === "New Zealand" && methods.watch("region") && 
                    nzRegions[methods.watch("region")] ? 
                    nzRegions[methods.watch("region")].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    )) : methods.watch("country") === "Australia" && methods.watch("region") && 
                    ausRegions[methods.watch("region")] ? 
                    ausRegions[methods.watch("region")].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    )) : null
                  }
                </select>
              </div>
              {(errors.country || errors.region || errors.district) && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.country?.message || errors.region?.message || errors.district?.message}
                </p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
                Services Offered *
              </label>
              <textarea
                id="services"
                rows="3"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                  errors.services ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="List the services your business offers (comma separated)"
                {...register("services", {
                  required: "Services are required",
                })}
              ></textarea>
              {errors.services && (
                <p className="mt-1 text-xs text-red-500">{errors.services.message}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="aboutBusiness" className="block text-sm font-medium text-gray-700 mb-1">
                About Business *
              </label>
              <textarea
                id="aboutBusiness"
                rows="4"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                  errors.aboutBusiness ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tell us about your business"
                {...register("aboutBusiness", {
                  required: "Business description is required",
                  minLength: {
                    value: 50,
                    message: "Description should be at least 50 characters",
                  },
                })}
              ></textarea>
              {errors.aboutBusiness && (
                <p className="mt-1 text-xs text-red-500">{errors.aboutBusiness.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Character count: {methods.watch("aboutBusiness")?.length || 0}/500
              </p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Business Website (Optional)
              </label>
              <input
                id="website"
                type="url"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0 ${
                  errors.website ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://www.yourbusiness.com"
                {...register("website", {
                  pattern: {
                    value: /^(https?:\/\/)?([\w\-])+\.([\w\-\.]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
                    message: "Invalid URL format",
                  },
                })}
              />
              {errors.website && (
                <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
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

export default Listing; 