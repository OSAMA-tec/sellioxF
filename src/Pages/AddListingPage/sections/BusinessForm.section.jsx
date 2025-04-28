// BusinessForm.section.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleFileChange } from "../../../utils/helperFunctions/handleFileChange";
import { ausRegions, nzRegions } from "../../../data/locations";
import { IoMdClose } from "react-icons/io";

export default function BusinessFormSection({ setFormStep, register, errors, setValue, trigger, getValues }) {
  const businessCard = useSelector((state) => state.listing.businessCard);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Initialize state from form values when component mounts
  useEffect(() => {
    // Get form values
    const formValues = getValues();
    
    // Initialize services
    if (formValues.services && Array.isArray(formValues.services)) {
      setServices(formValues.services);
    }
    
    // Initialize country and dependent dropdowns
    if (formValues.country) {
      setSelectedCountry(formValues.country);
      
      if (formValues.country === "New Zealand") {
        setRegions(Object.keys(nzRegions));
        if (formValues.region && nzRegions[formValues.region]) {
          setDistricts(nzRegions[formValues.region]);
        }
      } else if (formValues.country === "Australia") {
        setRegions(Object.keys(ausRegions));
        if (formValues.region && ausRegions[formValues.region]) {
          setDistricts(ausRegions[formValues.region]);
        }
      }
    }
    
    // If an image URL has been created earlier but not set to state
    if (formValues.logoPreviewUrl) {
      setSelectedLogo(formValues.logoPreviewUrl);
    }
  }, [getValues]);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setValue("country", country);
    if (country === "New Zealand") {
      setRegions(Object.keys(nzRegions));
      setDistricts([]);
    } else if (country === "Australia") {
      setRegions(Object.keys(ausRegions));
      setDistricts([]);
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setValue("region", region);
    if (selectedCountry === "New Zealand") {
      setDistricts(nzRegions[region] || []);
    } else if (selectedCountry === "Australia") {
      setDistricts(ausRegions[region] || []);
    }
  };

  const handleDistrictChange = (e) => {
    setValue("district", e.target.value);
  };

  const handleNextStep = async () => {
    const isValid = await trigger([
      "logo",
      "businessTitle",
      "businessEmailAddress",
      "services",
      "businessInfo",
      "businessWebsite",
      "country",
      "region",
      "district",
    ]);
    if (isValid) {
      const country = getValues("country");
      const region = getValues("region");
      const district = getValues("district");
      const location = `${district}, ${region}, ${country}`;
      setValue("location", location);
      setFormStep((prevStep) => prevStep + 1);
    }
  };

  const handleAddService = () => {
    if (serviceName) {
      setServices([...services, serviceName.trim()]);
      setValue("services", [...services, serviceName.trim()]);
      setServiceName(""); // Clear input after adding
    }
  };

  const handleRemoveService = (name) => {
    const updatedServices = services.filter((s) => s !== name);
    setServices(updatedServices);
    setValue("services", updatedServices);
  };

  const handleRemoveImage = () => {
    setSelectedLogo(null);
    setValue("logo", null);
    setValue("logoPreviewUrl", null);
  };

  const handleLogoChange = (e) => {
    handleFileChange(e, setSelectedLogo, setValue);
    // Store preview URL in form values for persistence
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setValue("logoPreviewUrl", imageUrl);
    }
  };

  const logo = useMemo(() => selectedLogo || businessCard?.logo, [selectedLogo, businessCard?.logo]);

  return (
    <section className="flex flex-col py-10 capitalize items-center">
      <div className="max-w-screen-lg w-full">
        <div className="flex flex-col gap-4 items-start mx-auto">
          <div className="w-4/6 flex flex-col gap-4 mx-auto">
            <div className="w-full h-full shadow-2xl px-4 py-3 flex flex-col justify-around rounded-lg border">
              <div className="flex flex-col justify-center gap-10 items-center mb-3">
                <h2>business details</h2>
                <div className="flex flex-col items-center justify-center gap-2 relative">
                  {logo && <IoMdClose size={20} className="absolute -top-2 -right-2 cursor-pointer" onClick={handleRemoveImage} />}
                  <label htmlFor="logo" className="w-36 h-36 rounded-full flex items-center justify-center border hover:cursor-pointer">
                    {logo ? (
                      <>
                        <img src={logo} className="w-36 h-36 object-cover rounded-full" />
                      </>
                    ) : (
                      <span className="text-xs text-center font-semibold">Upload your business logo</span>
                    )}
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    hidden
                    {...register("logo")}
                    onChange={handleLogoChange}
                  />
                  {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
                </div>
                <div className="flex flex-col">
                  <div>
                    <input
                      placeholder="Business Title"
                      type="text"
                      id="businessTitle"
                      className="border py-2 px-3"
                      {...register("businessTitle")}
                    />
                    {errors.businessTitle && <p className="text-red-500">{errors.businessTitle.message}</p>}
                  </div>
                  <div className="py-3">
                    <input
                      placeholder="Business Email Address"
                      type="text"
                      id="businessEmailAddress"
                      className="border py-2 px-3"
                      {...register("businessEmailAddress")}
                    />
                    {errors.businessEmailAddress && <p className="text-red-500">{errors.businessEmailAddress.message}</p>}
                  </div>
                </div>
              </div>
              <hr />
              <div className="py-3 flex flex-col items-center gap-4">
                <label>Country</label>
                <select 
                  className="border py-2 px-3 w-full" 
                  onChange={handleCountryChange} 
                  value={selectedCountry || ""}
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Australia">Australia</option>
                </select>
                {errors.country && <p className="text-red-500">{errors.country.message}</p>}
                <label>Region</label>
                <select 
                  className="border py-2 px-3 w-full" 
                  onChange={handleRegionChange} 
                  value={getValues("region") || ""}
                  disabled={!regions.length}
                >
                  <option value="" disabled>
                    Select Region
                  </option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && <p className="text-red-500">{errors.region.message}</p>}
                <label>District</label>
                <select 
                  className="border py-2 px-3 w-full" 
                  onChange={handleDistrictChange} 
                  value={getValues("district") || ""}
                  disabled={!districts.length}
                >
                  <option value="" disabled>
                    Select District
                  </option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500">{errors.district.message}</p>}
              </div>
              <hr />
              <div className="py-4 flex flex-col gap-4 items-center">
                <label>Enter other services</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Service Name"
                    className="py-2 px-3 border"
                    value={serviceName}
                    onChange={(e) => {
                      setServiceName(e.target.value);
                    }}
                  />
                  <button type="button" className="btn-black" onClick={handleAddService}>
                    Add Service
                  </button>
                  {errors.services && <p className="text-red-500">{errors.services.message}</p>}
                </div>
                <ul>
                  {services?.map((s, i) => (
                    <li className="flex gap-3 items-center" key={i}>
                      <span>{s}</span>
                      <span className="hover:cursor-pointer text-red-500" onClick={() => handleRemoveService(s)}>
                        Remove
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <hr />
              <div className="py-4 mx-auto w-full">
                <textarea
                  rows={3}
                  type="text"
                  className="py-2 px-3 border mx-auto w-full rounded-lg"
                  placeholder="Business Info"
                  {...register("businessInfo")}
                />
                {errors.businessInfo && <p className="text-red-500">{errors.businessInfo.message}</p>}
              </div>
              <hr />
              <div className="py-4 mx-auto">
                <input type="text" className="py-2 px-3 border mx-auto " placeholder="Business Website" {...register("businessWebsite")} />
                {errors.businessWebsite && <p className="text-red-500">{errors.businessWebsite.message}</p>}
              </div>
            </div>
            <div className="md:ms-auto flex flex-col md:flex-row gap-3">
              <button 
                className="btn-primary py-2 px-4 rounded-lg bg-primaryA0 text-white hover:bg-primaryA0/90 transition-colors" 
                type="button" 
                onClick={handleNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
