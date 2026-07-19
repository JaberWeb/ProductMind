"use client";

import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { PasswordInput } from "@/components/password-input";

type FormData = { name: string; email: string; password: string };

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error: signUpError } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (signUpError) {
      setError(signUpError.message || "Registration failed");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 px-4">
      <div className="w-full max-w-sm animate-fade-up rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <UserPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Get started with ProductMind</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
              })}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <PasswordInput
            label="Password"
            error={errors.password?.message}
            placeholder="At least 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
