import * as Yup from "yup";
import convertBase64ToFile from "../helperFunctions/convertBase64ToFile";

export const listingSchema = (maxImages = 5) =>
  Yup.object().shape({
    serviceTitle: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
    serviceDescription: Yup.string().required("Description is required"),
    servicePlan: Yup.string().required("Plan is required"),
    serviceImages: Yup.array()
      .of(
        Yup.mixed()
          .required("Image is required")
          .test("fileType", "Unsupported file type", (value) => {
            return value && ["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(value.type);
          })
          .test("fileSize", "File size is too large (max 5 MB)", (value) => {
            return value && value.size <= 5 * 1024 * 1024; // 5 MB = 5 * 1024 * 1024 bytes
          })
      )
      .min(1, "At least one service image is required")
      .max(maxImages, `You can upload a maximum of ${maxImages} images for your plan`)
      .required("Service images are required"),
    logo: Yup.mixed(),
     /*  .required("Image is required")
      .test("fileType", "Unsupported file type", (value) => {
        return value && ["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(value.type);
      })
      .test("fileSize", "File size is too large (max 100 KB)", (value) => {
        return value && value.size <= 102400; // 100 KB
      }), */
    businessTitle: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
    businessEmailAddress: Yup.string().required("Address is required").email("Email address is not valid"),
    businessInfo: Yup.string().required("Description is required"),
    businessWebsite: Yup.string().url("Enter a valid website URL"),
    /* location: Yup.string().oneOf(["Australia", "New Zealand"], "Location is required"), */
    services: Yup.array()
      .of(Yup.string().required("Service name is required"))
      .min(1, "At least one service is required")
      .required("Services are required"),
    serviceCategory: Yup.string().required("Service Category is required"),
    serviceSubCategory: Yup.string(),

    /* paymentMethod:Yup.string().required("Payment Method is required") */
  });
