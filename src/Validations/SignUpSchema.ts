import * as Yup from "yup";

type Tforminputs = {
  firstName: string;
  lastName: string;
  tradeName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  governorate: string;
  city: string;
  scopeOfWork: string;
  accountType: string;
  bio: string;
  services: string;
  sections: string;
  commercialRegister: File | null;
  taxCard: File | null;
  personalCard: File | null;
  coverPhoto: File | null;
};

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name is too long, it should be less than 50 characters")
    .required("Please enter your first name"),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name is too long, it should be less than 50 characters")
    .required("Please enter your last name"),

  email: Yup.string()
    .email("The email address entered is invalid")
    .required("Please enter your email address"),

  phone: Yup.string()
    .matches(/^\d{10,15}$/, "Phone number must be between 10 to 15 digits")
    .required("Please enter your phone number"),

  password: Yup.string()
    .min(8, "Password is too short, it must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .required("Please enter a password"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  governorate: Yup.string().required("Please select a governorate"),

  city: Yup.string().required("Please select a city"),

  scopeOfWork: Yup.string().required("Please enter your scope of work"),

  accountType: Yup.string().required("Please select an account type"),

  bio: Yup.string()
    .max(500, "Bio is too long, it must be under 500 characters")
    .required("Please enter a short bio"),

  services: Yup.string().required("Please enter the services you provide"),

  sections: Yup.string().required("Please select sections"),

  tradeName: Yup.string()
    .min(2, "Trade name is too short, it must be at least 2 characters long")
    .max(100, "Trade name is too long, it should be less than 100 characters")
    .required("Please enter your trade name"),

  commercialRegister: Yup.mixed()
    .nullable() // To allow null values
    .test(
      "fileRequired",
      "Commercial Register is required",
      (value) => value instanceof File
    ),

  taxCard: Yup.mixed()
    .nullable()
    .test(
      "fileRequired",
      "Tax Card is required",
      (value) => value instanceof File
    ),

  personalCard: Yup.mixed()
    .nullable()
    .test(
      "fileRequired",
      "Personal Card is required",
      (value) => value instanceof File
    ),

  coverPhoto: Yup.mixed()
    .nullable()
    .test(
      "fileRequired",
      "Cover Photo is required",
      (value) => value instanceof File
    ),
});

export { SignupSchema, type Tforminputs };
