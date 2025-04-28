import * as Yup from "yup";

//signing in schema
export const signinSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(1, "Password must be at least 6 characters").required("Password is required"),
});

//sign up schema

export const signupSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores")
    .test("no-spaces", "Username cannot contain spaces", (value) => !/\s/.test(value)),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  referralCode: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const updateUserSchema = Yup.object().shape({
  fullName: Yup.string(),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  address: Yup.string(),
  about: Yup.string(),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().nullable().min(6, "Current password must be at least 6 characters"),
  newPassword: Yup.string().nullable().min(6, "New password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .nullable()
    .test("passwords-match", "Passwords must match", function (value) {
      return !this.parent.newPassword || value === this.parent.newPassword;
    }),
  phoneNumber: Yup.string()
    .nullable()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});
