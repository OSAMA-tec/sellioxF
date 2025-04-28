import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";

const Service = ({ handleBack, handleNext }) => {
  const { register, formState: { errors }, handleSubmit, getValues, setValue, watch } = useFormContext();
  const [services, setServices] = useState(watch("services") || []);

  const onSubmit = (data) => {
    setValue("services", services);
    handleNext();
  };

  const addService = () => {
    setServices([...services, { name: "", description: "", price: "" }]);
  };

  const removeService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Services and Amenities</h2>
          <p className="text-sm text-gray-600 mb-6">
            Add services and amenities that your listing offers. This will help visitors understand
            what they can expect from your business.
          </p>

          <div className="space-y-6">
            {services.length > 0 ? (
              services.map((service, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Service #{index + 1}</h3>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 transition p-1"
                      onClick={() => removeService(index)}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor={`service-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name
                      </label>
                      <input
                        id={`service-name-${index}`}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0"
                        value={service.name}
                        onChange={(e) => updateService(index, "name", e.target.value)}
                        placeholder="e.g., Wi-Fi, Breakfast, Guided Tour"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor={`service-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id={`service-description-${index}`}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0"
                        value={service.description}
                        onChange={(e) => updateService(index, "description", e.target.value)}
                        placeholder="Describe the service in detail"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor={`service-price-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Price (optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          id={`service-price-${index}`}
                          type="text"
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primaryA0 focus:border-primaryA0"
                          value={service.price}
                          onChange={(e) => updateService(index, "price", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No services added yet.</p>
              </div>
            )}

            <button
              type="button"
              onClick={addService}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryA0 transition"
            >
              <FaPlus className="mr-2 w-3 h-3" />
              Add Service
            </button>
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

export default Service; 