import * as Yup from "yup";


//signing in schema
export const reviewSchema = Yup.object().shape({
    comment: Yup.string()
    .max(250,"comment cannot exceed 250 characters")
    .required('comment is required'),
    rating: Yup.number()
    .min(1, 'Rating must be at least 1')
    .max(5,"Rating cannot exceed 5")
    .required('Rating is required')
  });

