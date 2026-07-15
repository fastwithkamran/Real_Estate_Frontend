import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import { useState } from "react";

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (!data.email) {
        toast.error("Email is undefined");
        return;
      }

      if (!data.password) {
        toast.error("Password is undefined");
        return;
      }

      setLoading(true);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await fetch("/api/user/login", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/");
        toast.success(result.msg)
        reset();
      } else {
        toast.error(`Error: ${result.msg}`);
      }
      setLoading(false);
      return;
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      toast.error("Error failed to fetch API request");
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center font-semibold my-7">Login</h1>

      <form
        encType="multipart/form-data"
        className="flex flex-col gap-4 decoration-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          className="border-none bg-amber-50 p-3 rounded-lg pr-14 sm:pr-64"
          type="email"
          {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please provide a valid Email",
            },
          })}
          placeholder="Email Address"
        />
        {errors?.email && (
          <p className="text-sm text-center text-red-600">
            {errors.email.message}
          </p>
        )}
        <input
          type="text"
          className="border-none bg-amber-50 p-3 rounded-lg"
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        <button
          disable={loading}
          type="submit"
          className="bg-slate-700 disabled:opacity-80 text-white font-bold p-3 rounded-lg hover:opacity-95"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/auth/signup" className="text-blue-700">
          <span>Sign up</span>
        </Link>
      </div>
    </>
  );
}

export default Login;
