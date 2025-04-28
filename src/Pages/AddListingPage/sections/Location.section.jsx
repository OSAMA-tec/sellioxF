import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const Location = ({ handleBack, handleNext }) => {
  const { register, formState: { errors }, handleSubmit, setValue, watch } = useFormContext();
  const [mapReady, setMapReady] = useState(false);

  const onSubmit = (data) => {
    handleNext();
  };

  // Mock function to simulate address validation
  const validateAddress = () => {
    // In a real implementation, this would call a geocoding API
    setMapReady(true);
    // Set coordinates in the form
    setValue("coordinates.lat", 40.7128);
    setValue("coordinates.lng", -74.0060);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Location Information</h2>
          <p className="text-sm text-gray-600 mb-6">
            Provide the address where your property is located. This will help guests find your place.
          </p>

          <div className="space-y-6">
            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country*
              </label>
              <select
                id="country"
                {...register("country", { required: "Country is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
              >
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="AU">Australia</option>
                <option value="JP">Japan</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            {/* Street Address */}
            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address*
              </label>
              <input
                id="streetAddress"
                type="text"
                {...register("streetAddress", { required: "Street address is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                placeholder="Enter street address"
              />
              {errors.streetAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.streetAddress.message}</p>
              )}
            </div>

            {/* Apartment, suite, etc. */}
            <div>
              <label htmlFor="aptSuite" className="block text-sm font-medium text-gray-700 mb-1">
                Apartment, Suite, etc. (optional)
              </label>
              <input
                id="aptSuite"
                type="text"
                {...register("aptSuite")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                placeholder="Apt, Suite, Unit, etc."
              />
            </div>

            {/* City, State, Zip in a grid for responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city", { required: "City is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* State/Province */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province*
                </label>
                <input
                  id="state"
                  type="text"
                  {...register("state", { required: "State/Province is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                  placeholder="State/Province"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              {/* Zip/Postal Code */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code*
                </label>
                <input
                  id="zipCode"
                  type="text"
                  {...register("zipCode", { required: "ZIP/Postal code is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                  placeholder="ZIP/Postal code"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>
            </div>

            {/* Validate Address Button */}
            <div>
              <button
                type="button"
                onClick={validateAddress}
                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md shadow-sm transition duration-300"
              >
                <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                Validate Address
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Click to verify your address and see it on the map.
              </p>
            </div>

            {/* Map Preview (Placeholder) */}
            {mapReady && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Verified Location</h3>
                <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-600">
                    Map would appear here with marker at {watch("streetAddress")}, {watch("city")}, {watch("state")} {watch("zipCode")}
                  </p>
                  {/* In a real implementation, you would integrate with Google Maps or similar */}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Note: For privacy reasons, your exact location won't be shown to guests until they book.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md shadow transition duration-300"
          >
            <FaArrowLeft className="w-3 h-3" />
            Previous
          </button>
          <button
            type="submit"
            disabled={!mapReady}
            className={`flex items-center gap-2 px-4 py-2 rounded-md shadow transition duration-300 ${
              mapReady 
                ? "bg-primaryA0 hover:bg-primaryB0 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next Step
            <FaArrowRight className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Location; 