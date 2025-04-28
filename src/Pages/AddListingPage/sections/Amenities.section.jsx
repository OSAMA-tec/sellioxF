import React from "react";
import { useFormContext } from "react-hook-form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { 
  FaWifi, FaSwimmingPool, FaParking, FaTv, FaSnowflake, 
  FaFireExtinguisher, FaDumbbell, FaSpa, FaUtensils, 
  FaBabyCarriage, FaPaw, FaWheelchair, FaBroom
} from "react-icons/fa";

const Amenities = ({ handleBack, handleNext }) => {
  const { register, handleSubmit, formState: { errors } } = useFormContext();

  const onSubmit = (data) => {
    handleNext();
  };

  const amenitiesCategories = [
    {
      name: "Essentials",
      items: [
        { id: "wifi", label: "WiFi", icon: <FaWifi /> },
        { id: "tv", label: "TV", icon: <FaTv /> },
        { id: "kitchen", label: "Kitchen", icon: <FaUtensils /> },
        { id: "washer", label: "Washer", icon: <FaBroom /> },
        { id: "airConditioning", label: "Air conditioning", icon: <FaSnowflake /> },
        { id: "heating", label: "Heating", icon: <FaSnowflake /> },
        { id: "workspace", label: "Dedicated workspace", icon: <FaBroom /> },
      ]
    },
    {
      name: "Features",
      items: [
        { id: "pool", label: "Swimming pool", icon: <FaSwimmingPool /> },
        { id: "freeParking", label: "Free parking", icon: <FaParking /> },
        { id: "gym", label: "Gym", icon: <FaDumbbell /> },
        { id: "hotTub", label: "Hot tub", icon: <FaSpa /> },
        { id: "bbqGrill", label: "BBQ grill", icon: <FaUtensils /> },
      ]
    },
    {
      name: "Safety",
      items: [
        { id: "smokeAlarm", label: "Smoke alarm", icon: <FaFireExtinguisher /> },
        { id: "fireExtinguisher", label: "Fire extinguisher", icon: <FaFireExtinguisher /> },
        { id: "firstAidKit", label: "First aid kit", icon: <FaFireExtinguisher /> },
      ]
    },
    {
      name: "Special Considerations",
      items: [
        { id: "petsAllowed", label: "Pets allowed", icon: <FaPaw /> },
        { id: "infantFriendly", label: "Infant friendly", icon: <FaBabyCarriage /> },
        { id: "wheelchairAccessible", label: "Wheelchair accessible", icon: <FaWheelchair /> },
      ]
    }
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
          <p className="text-sm text-gray-600 mb-6">
            Select the amenities that your property offers to guests. These details help set guest expectations and make your listing stand out.
          </p>

          {/* Amenities Selection */}
          <div className="space-y-8">
            {amenitiesCategories.map((category) => (
              <div key={category.name} className="amenities-category">
                <h3 className="text-md font-medium text-gray-700 mb-3">{category.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.items.map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      <input
                        id={amenity.id}
                        type="checkbox"
                        {...register(`amenities.${amenity.id}`)}
                        className="h-4 w-4 text-primaryA0 focus:ring-primaryA0 border-gray-300 rounded"
                      />
                      <label htmlFor={amenity.id} className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-gray-500">{amenity.icon}</span>
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Amenities */}
          <div className="mt-8">
            <h3 className="text-md font-medium text-gray-700 mb-3">Other Amenities</h3>
            <p className="text-sm text-gray-600 mb-3">
              Is there anything special about your place that's not listed above?
            </p>
            <textarea
              {...register("amenities.additional")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryA0 focus:border-primaryA0"
              placeholder="Any other amenities or special features you'd like guests to know about..."
            />
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

export default Amenities; 