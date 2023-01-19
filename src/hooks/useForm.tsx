import React, { useState } from "react";

export const useForm = (
  initialFValues: object,
  validateOnChange = false,
  validate: any
) => {
  const [values, setValues] = useState<any>(initialFValues);
  const [errors, setErrors] = useState<any>();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
};

export const Form: React.FC<any> = ({ children, ...props }) => (
  <form autoComplete="off" {...props}>
    {children}
  </form>
);
