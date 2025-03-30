'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../input-field';
import Image from 'next/image';

type FormInfoProps = {
  type: 'create' | 'update';
  data?: any;
};

const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  firstName: z.string().min(1, { message: 'First name is required!' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  bloodType: z.string().min(1, { message: 'Blood type is required' }),
  birthday: z.date({ message: 'Birthday is required' }),
  sex: z.enum(['male', 'female'], { message: 'Sex is required' }),
  img: z.instanceof(File, { message: 'Image is required' }),
});

type Inputs = z.infer<typeof schema>;

const Studentform = ({ type, data }: FormInfoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    // Handle form submission logic here
    // For example, you can send the data to an API or perform any other action
    // reset form after submission
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new student</h1>
      <span className="text-xs text-gray-400 capitalize font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          type="text"
          register={register}
          name="username"
          errors={errors.username}
          defaultValue={data?.username}
        />
        <InputField
          label="Email"
          type="email"
          register={register}
          name="email"
          errors={errors.email}
          defaultValue={data?.email}
        />
        <InputField
          label="Password"
          type="password"
          register={register}
          name="password"
          errors={errors.password}
          defaultValue={data?.password}
        />
      </div>
      <span className="text-xs text-gray-400 capitalize font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          type="text"
          register={register}
          name="firstName"
          errors={errors.firstName}
          defaultValue={data?.firstName}
        />
        <InputField
          label="Last Name"
          type="text"
          register={register}
          name="lastName"
          errors={errors.lastName}
          defaultValue={data?.lastName}
        />
        <InputField
          label="Phone"
          type="number"
          register={register}
          name="phone"
          errors={errors.phone}
          defaultValue={data?.phone}
        />

        <InputField
          label="Address"
          type="text"
          register={register}
          name="address"
          errors={errors.address}
          defaultValue={data?.address}
        />
        <InputField
          label="Blood Type"
          type="text"
          register={register}
          name="bloodType"
          errors={errors.bloodType}
          defaultValue={data?.bloodType}
        />
        <InputField
          label="Birthday"
          type="date"
          register={register}
          name="birthday"
          errors={errors.birthday}
          defaultValue={data?.birthday}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="sex" className="text-xs text-gray-500">
            Sex
          </label>
          <select
            id="sex"
            defaultValue={data?.sex}
            {...register('sex')}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-red-500 text-xs">
              {errors.sex?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            htmlFor="img"
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input id="img" type="file" {...register('img')} className="hidden" />
          {errors.img?.message && (
            <p className="text-red-500 text-xs">
              {errors.img?.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default Studentform;
