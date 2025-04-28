import * as Yup from 'yup';

const paymentMethodSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  email:Yup.string().email()
});

export default paymentMethodSchema;
