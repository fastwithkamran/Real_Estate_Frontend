import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth";

function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (!data.fullName) {
        toast.error("Name is Undefined");
        return;
      }

      if (!data.email) {
        toast.error("Email is Undefined");
        return;
      }

      if (!data.password) {
        toast.error("Password is Undefined");
        return;
      }

      dispatch(loginStart);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.avator && data.avator.length > 0) {
        formData.append("avator", data.avator[0]);
      }

      const response = await fetch("/api/user/signup", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/");
        dispatch(loginSuccess(result));
        reset();
      } else {
        dispatch(loginFailure(result.msg));
      }
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      dispatch(loginFailure("Error failed to fetch API request"));
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form
        encType="multipart/form-data"
        className="flex flex-col gap-4 decoration-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          className="border-none bg-amber-50 p-3 rounded-lg sm:pr-64"
          type="text"
          {...register("fullName")}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="border-none bg-amber-50 p-3 rounded-lg"
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
        <input
          className="border-none  bg-amber-50 p-3 rounded-lg"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          {...register("avator")}
        />
        <button
          disable={loading}
          type="submit"
          className="bg-slate-700 disabled:opacity-80 text-white font-bold p-3 rounded-lg hover:opacity-95"
        >
          {loading ? "Loading..." : "Create Account"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/auth/login" className="text-blue-700">
          <span>Login</span>
        </Link>
      </div>
    </>
  );
}

export default Signup;
