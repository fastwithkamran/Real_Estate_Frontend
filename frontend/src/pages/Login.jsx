import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import apiFetch from "../services/apiClient"

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

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

      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await apiFetch(import.meta.env.VITE_LOGIN_API, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/");
        reset();
      } else {
        toast.error(`Error: ${result.msg}`);
      }
    } catch (error) {
      toast.error("Error failed to fetch API request");
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-4">Login</h1>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md lg:gap-2 gap-1 p-6 rounded-md bg-blue-300 flex flex-col"
      >
        <label className="font-bold mt-3">Email</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please provide a valid Email",
            },
          })}
          placeholder="Enter your email"
        />
        {errors?.email && (
          <p className="mt-1 bg-red-600 text-amber-50 flex-nowrap">
            {errors.email.message}
          </p>
        )}
        <label className="font-bold mt-3">Password</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="password"
          {...register("password")}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
        >
          Login
        </button>
      </form>
      <div className="w-full max-w-md p-6 rounded-md bg-blue-800 flex flex-col mt-3">
        <label className="font-bold mt-3 lg:text-2xl text-blue-100 flex justify-center">
          New User:
        </label>
        <button
          type="button"
          onClick={() => navigate("/auth/signup")}
          className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
        >
          Let's SignUp
        </button>
      </div>
    </>
  );
}

export default Login;
