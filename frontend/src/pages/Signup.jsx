import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import apiFetch from "../services/apiClient"

function Signup() {
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

      if (!data.fullName) {
        toast.error("Name is undefined");
        return;
      }

      if (!data.email) {
        toast.error("Email is undefined");
        return;
      }

      if (!data.phone) {
        toast.error("Phone is undefined");
        return;
      }

      if (!data.password) {
        toast.error("Password is undefined");
        return;
      }

      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);

      if (data.avator && data.avator.length > 0) {
        formData.append("avator", data.avator[0]);
      }

      const response = await apiFetch(import.meta.env.VITE_SIGNUP_API, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        reset();
        navigate("/");
      } else {
        toast.error(`Errror: ${result.msg}`);
      }
    } catch (error) {
      toast.error("Error failed to fetch API request");
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-2">
        Sign Up
      </h1>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md lg:gap-2 gap-1 p-6 rounded-md bg-blue-300 flex flex-col"
      >
        <label className="font-bold">Full Name</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("fullName")}
          placeholder="Enter your full name"
        />
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

        <label className="font-bold mt-3">Phone</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("phone", {
            pattern: {
              value: /^923\d{9}$/,
              message:
                "Please provide a valid Pakistani mobile number in 923123456789 format",
            },
          })}
          placeholder="Enter your number"
        />
        {errors?.phone && (
          <p className="mt-1 bg-red-600 text-amber-50 flex-nowrap">
            {errors.phone.message}
          </p>
        )}

        <label className="font-bold mt-3">Password</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="password"
          {...register("password")}
          placeholder="Enter your password"
        />
        <label className="font-bold mt-3">Avator</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          {...register("avator")}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
        >
          Create Account
        </button>
      </form>
    </>
  );
}

export default Signup;
