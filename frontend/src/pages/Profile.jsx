import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Profile() {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const [setUpdateProfile] = useState(0);
  const [loading, setLoading] = useState(false);
  const [avatorURL, setAvatorURL] = useState(currentUser.avator);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/verify-auth", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          navigate("/auth/login");
          toast.error(result.msg);
        }
      } catch (error) {
        if (import.meta.env.VITE_ERROR === "development") console.error(error);
        navigate("/");
        toast.error("Error failed to fetch API request");
      }
    };
    fetchData();
  }, [navigate]);

  const handleUpdateProfile = async (data) => {
    try {
      const formData = new FormData();

      if (data.fullName) {
        formData.append("fullName", data.fullName);
      }
      if (data.email) {
        formData.append("email", data.email);
      }

      if (data.avator && data.avator.length > 0) {
        formData.append("avator", data.avator[0]);
      }

      setLoading(true);

      const response = await fetch(
        `/api/profile/profile-update/${currentUser._id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok) {
        reset();
        setUpdateProfile((prev) => prev + 1);
      } else {
        toast.error(`Error: ${result.msg}`);
      }
      setLoading(false);
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      setLoading(false);
      toast.error("Error failed to fetch API request");
    }
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/");
        toast.success(result.msg);
      } else {
        toast.error(result.msg);
      }
      setLoading(false);
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      setLoading(false);
      toast.error("Error failed to fetch API request");
    }
  };

  const handleUpdatePassword = async (data) => {
    try {
      const formData = new FormData();

      if (!data.password) {
        toast.error("Current Password Not Found");
        return;
      }

      if (!data.newpassword) {
        toast.error("New Password Not Found");
        return;
      }

      setLoading(true);
      formData.append("currentpassword", data.password);
      formData.append("newpassword", data.newpassword);

      const response = await fetch(
        `/api/profile/update-password/${currentUser._id}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok) {
        navigate("/");
        toast.success(result.msg);
      } else {
        toast.error(result.msg);
      }
      setLoading(false);
    } catch (error) {
      if (import.meta.env.VITE_ERROR === "development") console.error(error);
      setLoading(false);
      toast.error("Error failed to fetch API request");
    }
  };

  return !currentUser ? (
    navigate("/auth/login")
  ) : (
    <>
      <div className="mr-auto ml-2">
        <Link
          to="/"
          className="text-2xl font-medium text-slate-500 hover:text-blue-600"
        >
          Back
        </Link>
      </div>

      <h1 className="font-bold text-3xl mb-2">Profile</h1>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(handleUpdateProfile)}
        className="w-full max-w-md gap-1 p-6 flex flex-col"
      >
        <label htmlFor="avator" className="flex justify-center">
          <img
            src={avatorURL}
            alt="Avator"
            className="w-20 h-20 object-cover rounded-full cursor-pointer"
          />
        </label>
        <input
          hidden
          id="avator"
          type="file"
          accept="image/*"
          {...register("avator", {
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (avatorURL.startsWith("blob:"))
                  URL.revokeObjectURL(avatorURL);
              }
              setAvatorURL(URL.createObjectURL(file));
              toast.success("Image Uploaded Successfully");
            },
          })}
        />
        <label className="font-bold text-gray-600">
          Full Name: {currentUser.fullName}
        </label>
        <input
          className="border-none bg-amber-50 p-3 rounded-lg w-full"
          type="text"
          {...register("fullName")}
          placeholder="Update your full name"
        />
        <label className="font-bold mt-3 text-gray-600">
          Email: {currentUser.email}
        </label>
        <input
          className="border-none bg-amber-50 p-3 rounded-lg w-full"
          type="text"
          {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please provide a valid Email",
            },
          })}
          placeholder="Update your email"
        />
        {errors?.email && (
          <p className="text-sm text-center text-red-600">
            {errors.email.message}
          </p>
        )}
        <button
          disable={loading}
          type="submit"
          className="bg-slate-700 disabled:opacity-80 text-white font-bold p-3 rounded-lg hover:opacity-95 mt-3"
        >
          {loading ? "Loading..." : "Update Account"}
        </button>
      </form>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(handleUpdatePassword)}
        className="max-w-md w-full gap-1 p-6 flex flex-col mt-5"
      >
        <label className="font-bold text-gray-600">Current Password</label>
        <input
          className="border-none bg-amber-50 p-3 rounded-lg w-full5"
          type="text"
          {...register("password")}
          placeholder="Enter your current password"
        />
        <label className="font-bold text-gray-600 mt-3">New Password</label>
        <input
          className="border-none bg-amber-50 p-3 rounded-lg w-full"
          type="text"
          {...register("newpassword")}
          placeholder="Enter your new password"
        />

        <button
          disable={loading}
          onClick={handleUpdatePassword}
          type="submit"
          className="bg-slate-700 disabled:opacity-80 text-white font-bold p-3 rounded-lg hover:opacity-95 mt-3"
        >
          {loading ? "Loading..." : "Update Password"}
        </button>
      </form>

      <div className="text-2xl mt-5 text-red-600 font-bold">Delete Account</div>
      <div className="max-w-md w-full gap-1 p-6 flex flex-col mb-5">
        <button
          disable={loading}
          onClick={handleAccountDelete}
          type="submit"
          className="bg-red-600 disabled:opacity-80 text-white font-bold p-3 rounded-lg hover:opacity-95"
        >
          {loading ? "Loading..." : "Delete Account"}
        </button>
      </div>
    </>
  );
}

export default Profile;
