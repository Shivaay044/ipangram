"use client"

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import instance from "@/config/axios.config";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  role: z.enum(["manager", "employee"], { required_error: "Role is required" }),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  hobbies: z
    .array(z.string())
    .min(1, "Select at least one hobby"),
  password: z
    .string()
    .min(20, "Password must be at least 20 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[0-9]/, "Password must have at least one number")
    .regex(/[@$!%*?&]/, "Password must have at least one special character"),
});

type FormData = z.infer<typeof schema>;

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    instance
    .post("/api/auth/register", data)
    .then((res) => {
      alert("registered Successfully!!");
    })
    .catch((err) => {
      alert(err.message);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">First Name:</label>
          <input {...register("firstName")} className="input-field" />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Last Name:</label>
          <input {...register("lastName")} className="input-field" />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <input type="email" {...register("email")} className="input-field" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Role:</label>
          <select {...register("role")} className="input-field">
            <option value="">Select Role</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Gender:</label>
          <div className="flex gap-4">
            <label>
              <input type="radio" value="male" {...register("gender")} />
              Male
            </label>
            <label>
              <input type="radio" value="female" {...register("gender")} />
              Female
            </label>
          </div>
          {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Hobbies:</label>
          <div className="flex gap-4">
            {["Reading", "Gaming", "Music", "Sports"].map((hobby) => (
              <label key={hobby}>
                <input
                  type="checkbox"
                  value={hobby}
                  {...register("hobbies")}
                />
                {hobby}
              </label>
            ))}
          </div>
          {errors.hobbies && <p className="text-red-500">{errors.hobbies.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Password:</label>
          <input type="password" {...register("password")} className="input-field" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
