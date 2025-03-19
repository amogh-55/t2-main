"use client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const { mutate, isPending } = api.user.registerUser.useMutation({
    onSuccess: () => {
      alert("Account Created");
      router.push("/mainpage");
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-lg border border-white/20 shadow-2xl">
        <div className="mb-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Sign Up</div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              {...register("name")}
              placeholder="Full Name"
              className="w-full rounded-xl border-none bg-white/20 px-5 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            {errors.name && <p className="mt-2 text-xs text-pink-300">{errors.name.message}</p>}
          </div>

          <div className="relative">
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="w-full rounded-xl border-none bg-white/20 px-5 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            {errors.email && <p className="mt-2 text-xs text-pink-300">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full rounded-xl border-none bg-white/20 px-5 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            {errors.password && <p className="mt-2 text-xs text-pink-300">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 py-4 font-bold text-white transition hover:from-teal-500 hover:to-blue-600 transform hover:-translate-y-1 shadow-lg"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-blue-200">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-teal-300 hover:text-teal-400 transition"
            onClick={() => router.push("/")}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
}