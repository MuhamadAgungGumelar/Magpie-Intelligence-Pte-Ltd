import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';

interface FormDateProps {
  label: string;
  name: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
  placeholder?: string;
}

const FormDate: React.FC<FormDateProps> = ({
  label,
  name,
  required = false,
  register,
  error,
  disabled = false,
  className = '',
  min,
  max,
  placeholder,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        {...register(name)}
        type="date"
        disabled={disabled}
        min={min}
        max={max}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormDate;
