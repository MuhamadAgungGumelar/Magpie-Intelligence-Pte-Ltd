import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';

interface FormSelectProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  required = false,
  register,
  error,
  disabled = false,
  className = '',
  placeholder = 'Select an option',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        {...register(name)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-100 dark:disabled:bg-gray-800 ${
          error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormSelect;
