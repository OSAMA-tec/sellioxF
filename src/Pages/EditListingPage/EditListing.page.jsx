import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave, FaImages, FaMapMarkerAlt } from 'react-icons/fa';
import useUpdateListing from '../../utils/react-query-hooks/Listings/useUpdateListing';
import axiosInstance from '../../utils/axiosInstance/axiosInstance';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import { allCategories } from '../../data/links';
import { ausRegions, nzRegions } from '../../data/locations';
import config from '../../config';
// Validation schema
const schema = yup.object().shape({
  businessTitle: yup.string().required('Business name is required'),
  businessEmailAddress: yup.string().email('Invalid email format').required('Email is required'),
  serviceTitle: yup.string().required('Service title is required'),
  businessInfo: yup.string().required('Business information is required'),
  serviceDescription: yup.string().required('Service description is required'),
  serviceCategory: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  services: yup.array().min(1, 'At least one service is required'),
  website: yup.string(),
});

export default function EditListingPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [serviceImages, setServiceImages] = useState([]);
  const [logo, setLogo] = useState(null);
  const [servicesToDelete, setServicesToDelete] = useState([]);
  const [newService, setNewService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const apiURL = config.BACKEND_URL;
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      services: []
    }
  });
  
  const updateListing = useUpdateListing({
    onSuccess: (data) => {
      toast.success('Listing updated successfully');
      navigate('/mylistings/mylistings');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update listing');
    }
  });
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/listing/${listingId}`);
        const listingData = response.data.listing;
        setListing(listingData);
        
        // Set form values
        reset({
          businessTitle: listingData.businessTitle,
          businessEmailAddress: listingData.businessEmailAddress,
          serviceTitle: listingData.serviceTitle,
          businessInfo: listingData.businessInfo,
          serviceDescription: listingData.serviceDescription,
          serviceCategory: listingData.serviceCategory,
          serviceSubCategory: listingData.serviceSubCategory || '',
          location: listingData.location,
          services: listingData.services,
          website: listingData.website || '',
        });
        
        // Set location fields
        const locationParts = listingData.location.split(',').map(part => part.trim());
        if (locationParts.length >= 3) {
          setSelectedCountry(locationParts[2]);
          setSelectedRegion(locationParts[1]);
          setSelectedDistrict(locationParts[0]);
          
          // Set regions based on country
          if (locationParts[2] === 'New Zealand') {
            setRegions(Object.keys(nzRegions));
            if (nzRegions[locationParts[1]]) {
              setDistricts(nzRegions[locationParts[1]]);
            }
          } else if (locationParts[2] === 'Australia') {
            setRegions(Object.keys(ausRegions));
            if (ausRegions[locationParts[1]]) {
              setDistricts(ausRegions[locationParts[1]]);
            }
          }
        }
        
        // Set image previews
        if (listingData.serviceImages && listingData.serviceImages.length > 0) {
          setImagePreview(listingData.serviceImages.map(img => `${apiURL}/${img}`));
        }
        
        // Set logo preview
        if (listingData.logo) {
          setLogoPreview(`${apiURL}/${listingData.logo}`);
        }
        
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to fetch listing details');
        navigate('/mylistings/mylistings');
      }
    };
    
    fetchListing();
  }, [listingId, navigate, reset, apiURL]);
  
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedRegion('');
    setSelectedDistrict('');
    
    if (country === 'New Zealand') {
      setRegions(Object.keys(nzRegions));
      setDistricts([]);
    } else if (country === 'Australia') {
      setRegions(Object.keys(ausRegions));
      setDistricts([]);
    } else {
      setRegions([]);
      setDistricts([]);
    }
    
    updateLocation();
  };
  
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setSelectedDistrict('');
    
    if (selectedCountry === 'New Zealand') {
      setDistricts(nzRegions[region] || []);
    } else if (selectedCountry === 'Australia') {
      setDistricts(ausRegions[region] || []);
    } else {
      setDistricts([]);
    }
    
    updateLocation();
  };
  
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    updateLocation();
  };
  
  const updateLocation = () => {
    let location = '';
    
    if (selectedDistrict) {
      location += selectedDistrict;
    }
    
    if (selectedRegion) {
      location += location ? `, ${selectedRegion}` : selectedRegion;
    }
    
    if (selectedCountry) {
      location += location ? `, ${selectedCountry}` : selectedCountry;
    }
    
    setValue('location', location);
  };
  
  const handleAddService = () => {
    if (newService.trim()) {
      const currentServices = [...(listing.services || [])];
      if (!currentServices.includes(newService.trim())) {
        const updatedServices = [...currentServices, newService.trim()];
        setValue('services', updatedServices);
        setListing({ ...listing, services: updatedServices });
        setNewService('');
      } else {
        toast.warning('This service is already added');
      }
    }
  };
  
  const handleRemoveService = (serviceToRemove) => {
    const updatedServices = listing.services.filter(service => service !== serviceToRemove);
    setValue('services', updatedServices);
    setListing({ ...listing, services: updatedServices });
    setServicesToDelete([...servicesToDelete, serviceToRemove]);
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setServiceImages(files);
      
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview(newPreviews);
    }
  };
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const onSubmit = (data) => {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      if (key !== 'services') {
        formData.append(key, data[key]);
      }
    });
    
    // Add services as an array
    data.services.forEach((service, index) => {
      formData.append(`services[${index}]`, service);
    });
    
    // Add images if selected
    if (serviceImages.length > 0) {
      serviceImages.forEach(image => {
        formData.append('serviceImages', image);
      });
    }
    
    // Add logo if selected
    if (logo) {
      formData.append('logo', logo);
    }
    
    // Submit the form
    updateListing.mutate({ 
      listingId, 
      formData 
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/mylistings/mylistings')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Listing</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Business Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                {...register('businessTitle')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              />
              {errors.businessTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.businessTitle.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                {...register('businessEmailAddress')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              />
              {errors.businessEmailAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.businessEmailAddress.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
              <input
                type="text"
                {...register('website')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
              <textarea
                {...register('businessInfo')}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              />
              {errors.businessInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.businessInfo.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
              <div className="flex items-center space-x-4">
                {logoPreview && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                  <input 
                    type="file" 
                    onChange={handleLogoChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <FaImages size={18} />
                  <span>Choose Logo</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Service Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
              <input
                type="text"
                {...register('serviceTitle')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              />
              {errors.serviceTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceTitle.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                {...register('serviceCategory')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              >
                <option value="">Select Category</option>
                {Object.keys(allCategories).map((category) => (
                  <optgroup key={category} label={category}>
                    {allCategories[category].map((subcategory) => (
                      <option key={subcategory.header} value={subcategory.header}>
                        {subcategory.header}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.serviceCategory && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceCategory.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
                  >
                    <option value="">Select Country</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    disabled={!regions.length}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    disabled={!districts.length}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                <FaMapMarkerAlt className="text-primaryA0 mr-2" />
                <span className="text-sm text-gray-600">
                  {listing.location || 'No location selected'}
                </span>
              </div>
              
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
              <textarea
                {...register('serviceDescription')}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
              />
              {errors.serviceDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceDescription.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryA0 focus:border-primaryA0"
                  placeholder="Add a service..."
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {listing.services && listing.services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{service}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              
              {errors.services && (
                <p className="mt-1 text-sm text-red-600">{errors.services.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {imagePreview.map((src, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden h-24">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 w-fit">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <FaImages size={18} />
                  <span>Choose Images</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/mylistings/mylistings')}
            className="px-6 py-2 border border-gray-300 rounded-lg mr-4 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={updateListing.isLoading}
            className="px-6 py-2 bg-primaryA0 text-white rounded-lg hover:bg-primaryA0/90 transition-colors flex items-center gap-2"
          >
            {updateListing.isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <FaSave size={16} />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
} 