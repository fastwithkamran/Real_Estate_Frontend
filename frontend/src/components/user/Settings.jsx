import { useForm } from "react-hook-form";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";

function Settings() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [updateProfile, setUpdateProfile] = useState(0);
  const [fullName, setFullName] = useState("undefined");
  const [email, setEmail] = useState("undefined");
  const [phone, setPhone] = useState("undefined");
  const [avator, setAvator] = useState("undefined");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_AUTH_AND_USERPAYLOAD,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();

        if (response.ok) {
          setFullName(result.fullName);
          setEmail(result.email);
          setPhone(result.phone);
          setAvator(result.avator);
        } else {
          toast.error(result.msg);
        }
      } catch (error) {
        toast.error("Error failed to fetch API request");
        console.error("Error", error);
      }
    };
    fetchData();
  }, [updateProfile]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.fullName) {
        formData.append("fullName", data.fullName);
      }
      if (data.email) {
        formData.append("email", data.email);
      }
      if (data.phone) {
        formData.append("phone", data.phone);
      }

      if (data.avator && data.avator.length > 0) {
        formData.append("avator", data.avator[0]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_UPDATE_USERAPI}/${userId}`,
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
    } catch (error) {
      toast.error("Error failed to fetch API request");
      console.error("Error", error);
    }
  };

  const handleAccountDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_ACCOUNT_DELETE}/${userId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg);
        navigate("/");
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error failed to fetch API request");
    }
  };

  return (
    <>
      <div className="mr-auto ml-2">
        <Link
          to="/"
          className="md:text-2xl bg-amber-50 rounded-2xl border-2 p-2 text-pink-800"
        >
          Back
        </Link>
      </div>

      <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-2">
        Settings
      </h1>

      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md lg:gap-2 gap-1 p-6 rounded-md bg-blue-300 flex flex-col"
      >
        <div className="flex justify-center">
          <img src={avator} alt="Avator" className="w-20 h-20 object-cover" />
        </div>
        <label className="font-bold">Full Name: {fullName}</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("fullName")}
          placeholder="Update your full name"
        />
        <label className="font-bold mt-3">Email: {email}</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("email")}
          placeholder="Update your email"
        />
        <label className="font-bold mt-3">Phone: {phone}</label>
        <input
          className="border border-gray-300 bg-amber-50 px-3"
          type="text"
          {...register("phone")}
          placeholder="Update your number"
        />
        <label className="font-bold mt-3">Update Avator</label>
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
          Update Account
        </button>
      </form>

      <div className="text-2xl mt-5 text-red-600">Delete Account</div>
      <div>
        <button
          className="bg-red-500 w-50 p-2 mt-2 rounded-2xl text-white cursor-pointer hover:bg-gray-500"
          onClick={handleAccountDelete}
        >
          Delete
        </button>
      </div>
    </>
  );
}

export default Settings;
