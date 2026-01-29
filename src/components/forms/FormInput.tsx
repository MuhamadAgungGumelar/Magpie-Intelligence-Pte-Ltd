import React from "react";
import { UseFormRegister, FieldError, FieldValues } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  labelSuffix?: React.ReactNode;
  rightElement?: React.ReactNode;
  inputClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  register,
  error,
  disabled = false,
  className = "",
  labelSuffix = null,
  rightElement = null,
  inputClassName = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {labelSuffix}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-400 ${
            rightElement ? "pr-12" : ""
          } ${error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"} ${inputClassName}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
