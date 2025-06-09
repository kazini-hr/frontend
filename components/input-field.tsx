import React from 'react';
import { FieldError } from 'react-hook-form';

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  errors?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = 'text',
  register,
  name,
  defaultValue,
  errors,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>
      <input
        id={name}
        type={type}
        defaultValue={defaultValue}
        {...inputProps}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      />
      {errors?.message && (
        <p className="text-red-500 text-xs">{errors?.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
