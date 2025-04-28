import React from "react";
import { useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Details = ({ handleBack, handleNext }) => {
  const { register, formState: { errors }, handleSubmit, watch } = useFormContext();

  const onSubmit = (data) => {
    handleNext();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Listing Details</h2>
          <p className="text-sm text-gray-600 mb-6">
            Provide detailed information about your listing to help it stand out to potential guests.
          </p>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Listing Title*
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                placeholder="Enter a catchy title for your listing"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                rows={5}
                {...register("description", { 
                  required: "Description is required",
                  minLength: { value: 100, message: "Description should be at least 100 characters" }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                placeholder="Describe your property, its surroundings and what makes it special..."
              />
              <div className="flex justify-between mt-1">
                <p className={`text-xs ${errors.description ? 'text-red-600' : 'text-gray-500'}`}>
                  {errors.description ? errors.description.message : "Minimum 100 characters"}
                </p>
                <p className="text-xs text-gray-500">
                  {watch("description")?.length || 0}/2000
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
              >
                <option value="">Select a category</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="hotel">Hotel</option>
                <option value="cabin">Cabin</option>
                <option value="cottage">Cottage</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Guests*
                </label>
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="50"
                  {...register("guests", { 
                    required: "Max guests is required",
                    min: { value: 1, message: "Minimum 1 guest" },
                    max: { value: 50, message: "Maximum 50 guests" }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                />
                {errors.guests && (
                  <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms*
                </label>
                <input
                  id="bedrooms"
                  type="number"
                  min="0"
                  max="20"
                  {...register("bedrooms", { 
                    required: "Bedrooms is required",
                    min: { value: 0, message: "Minimum 0 bedrooms" },
                    max: { value: 20, message: "Maximum 20 bedrooms" }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms*
                </label>
                <input
                  id="bathrooms"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  {...register("bathrooms", { 
                    required: "Bathrooms is required",
                    min: { value: 0, message: "Minimum 0 bathrooms" },
                    max: { value: 10, message: "Maximum 10 bathrooms" }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price per Night ($)*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { 
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" }
                  })}
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
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

export default Details; 