import * as Yup from "yup";


//signing in schema
export const emailSchema = Yup.object().shape({
    message: Yup.string()
      .max(2000, "Message cannot exceed 2000 characters")
      .required('Message is required'),
  });

