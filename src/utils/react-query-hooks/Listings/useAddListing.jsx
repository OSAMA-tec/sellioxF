import axiosInstance from "../../axiosInstance/axiosInstance";
import { useMutation } from "react-query";

const addList = async (data) => {
  console.log("addlist", data);
  const formData = new FormData();

  // ============ PROCESS LOGO (SINGLE FILE) ============
  let usingDefaultLogo = data.usingDefaultLogo;

  // Add default logo parameters if using a generated logo
  if (usingDefaultLogo) {
    console.log("Using default generated logo");
    formData.append("usingDefaultLogo", "true");
    formData.append("defaultLogoColor", data.defaultLogoColor || "#10B981");
    formData.append("defaultLogoText", data.defaultLogoText || "B");
  }
  // Otherwise process actual logo file if available
  else if (data.logo) {
    try {
      // Handle different possible formats for logo:
      // 1. Direct File object
      // 2. Object with file property
      // 3. FileList from input element
      // 4. Array containing a File

      let logoFile = null;

      if (data.logo instanceof FileList) {
        // FileList from direct form input
        logoFile = data.logo[0];
      } else if (Array.isArray(data.logo) && data.logo.length > 0) {
        // Array of files
        logoFile = data.logo[0];
      } else if (data.logo.file) {
        // Object with file property
        logoFile = data.logo.file;
      } else {
        // Direct File object
        logoFile = data.logo;
      }

      if (logoFile instanceof File || logoFile instanceof Blob) {
        formData.append("logo", logoFile);
        console.log("Appending logo:", logoFile.name);
      } else {
        console.warn("Logo is not a valid file object:", logoFile);
        // Fall back to default logo if available
        if (data.defaultLogoColor) {
          console.log("Falling back to default logo");
          formData.append("usingDefaultLogo", "true");
          formData.append("defaultLogoColor", data.defaultLogoColor || "#10B981");
          formData.append("defaultLogoText", data.defaultLogoText || "B");
        }
      }
    } catch (error) {
      console.error("Error processing logo:", error);
      // Fall back to default logo if available
      if (data.defaultLogoColor) {
        console.log("Error occurred, falling back to default logo");
        formData.append("usingDefaultLogo", "true");
        formData.append("defaultLogoColor", data.defaultLogoColor || "#10B981");
        formData.append("defaultLogoText", data.defaultLogoText || "B");
      }
    }
  } else if (data.defaultLogoColor) {
    // No logo file but we have default logo parameters
    console.log("No logo file, using default logo settings");
    formData.append("usingDefaultLogo", "true");
    formData.append("defaultLogoColor", data.defaultLogoColor || "#10B981");
    formData.append("defaultLogoText", data.defaultLogoText || "B");
  }

  // ============ PROCESS SERVICE IMAGES (MULTIPLE FILES) ============
  // Handle different ways the images might be passed:
  // 1. data.serviceImages array
  // 2. data.photos array (from Photos component)

  try {
    let imagesToProcess = [];

    // Try serviceImages first
    if (data.serviceImages) {
      if (data.serviceImages instanceof FileList) {
        // Convert FileList to array
        imagesToProcess = Array.from(data.serviceImages);
      } else if (Array.isArray(data.serviceImages)) {
        imagesToProcess = data.serviceImages;
      } else {
        // Single file
        imagesToProcess = [data.serviceImages];
      }
    }
    // If no serviceImages, try photos array from the Photos component
    else if (data.photos) {
      if (data.photos instanceof FileList) {
        // Convert FileList to array
        imagesToProcess = Array.from(data.photos);
      } else if (Array.isArray(data.photos)) {
        imagesToProcess = data.photos;
      } else {
        // Single file
        imagesToProcess = [data.photos];
      }
    }

    // Process all images and append to formData
    if (imagesToProcess.length > 0) {
      console.log(`Processing ${imagesToProcess.length} service images`);

      imagesToProcess.forEach((image, index) => {
        try {
          // Handle both File objects and objects with file property
          let imageFile = null;

          if (image && image.file) {
            // Object with file property
            imageFile = image.file;
          } else {
            // Direct File object
            imageFile = image;
          }

          if (imageFile instanceof File || imageFile instanceof Blob) {
            formData.append("serviceImages", imageFile);
            console.log(`Appending service image ${index + 1}:`, imageFile.name);
          } else {
            console.warn(`Service image ${index + 1} is not a valid file object:`, imageFile);
          }
        } catch (imageError) {
          console.error(`Error processing image ${index + 1}:`, imageError);
        }
      });
    } else {
      console.log("No service images to process");
    }
  } catch (error) {
    console.error("Error processing service images:", error);
  }

  // ============ HANDLE OTHER FORM DATA ============
  // Append all other fields to the FormData
  Object.keys(data).forEach((key) => {
    // Skip file fields and fields we've already processed
    if (
      key !== "serviceImages" &&
      key !== "logo" &&
      key !== "photos" &&
      key !== "usingDefaultLogo" &&
      key !== "defaultLogoColor" &&
      key !== "defaultLogoText"
    ) {
      // Handle arrays properly with [] notation for backend compatibility
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => {
          if (item !== null && item !== undefined) {
            formData.append(`${key}[]`, item);
          }
        });
      } else {
        // Skip null or undefined values
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
    }
  });

  // Log all formData keys for debugging
  for (let pair of formData.entries()) {
    console.log(`FormData contains: ${pair[0]}: ${pair[1]}`);
  }

  // Submit the form data to the API
  const response = await axiosInstance.post("/listing/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const useAddListing = (onSuccess, onError) => {
  return useMutation(addList, {
    onSuccess,
    onError,
  });
};

export default useAddListing;
