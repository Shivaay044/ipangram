"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inspect } from "util";
import instance from "@/config/axios.config";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8,"min 8 chars"),
});

type LoginData = z.infer<typeof schema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginData) => {
    console.log("Login Data:", data);
    instance
      .post("/api/auth/login", data)
      .then((res: any) => {
        alert("loggedIn Successfully!!");
        window.location.href = `/${res.data.role}`;
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Email:</label>
          <input type="email" {...register("email")} className="input-field" />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            {...register("password")}
            className="input-field"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
