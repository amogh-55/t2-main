"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";

interface SignUpFormValues {
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

  const { mutate, isPending } = api.user.login.useMutation({
    onSuccess: ({ user }) => {
      if (user) router.push("/mainpage");
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-lg border border-white/20 shadow-2xl">
        <div className="mb-1 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Sign In</div><br></br>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-xl border-none bg-white/20 px-5 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {errors.email && (
              <p className="mt-2 text-xs text-pink-300">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-xl border-none bg-white/20 px-5 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {errors.password && (
              <p className="mt-2 text-xs text-pink-300">{errors.password.message}</p>
            )}
          </div>

        

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-teal-400 to-blue-500 py-4 font-bold text-white transition hover:from-teal-500 hover:to-blue-600 transform hover:-translate-y-1 shadow-lg"
            disabled={isPending}
          >
            {isPending ? "Sign In" : "Sign In"}
          </button>
          <div className="flex justify-between text-sm text-blue-200">
            <p
              className="cursor-pointer hover:text-teal-300 transition"
              onClick={() => router.push("/auth/signup")}
            >
                                Create Account
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}