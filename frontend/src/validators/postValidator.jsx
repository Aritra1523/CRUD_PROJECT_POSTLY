import * as yup from "yup";

export const ProductValidator = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(2, "Title is too short")
    .required("Title is required"),
  subtitle: yup
    .string()
    .trim()
    .min(4, "Subtitle is too short")
    .required("Subtitle is required"),
  content: yup
    .string()
    .trim()
    .min(10, "Content is too short, 10 characters mandatory")
    .required("Content is required"),
});
