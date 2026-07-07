import { useForm } from "react-hook-form";

function Signup() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("cnic", data.cnic);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (data.avator && data.avator.length > 0) {
        formData.append("avator", data.avator[0]);
      }

      const response = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.msg);
      } else {
        alert(result.msg);
      }
    } catch (error) {
      alert("Upload Failed Error");
      console.log("Error", error);
    }
    reset();
  };

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-200 p-4"> 
        
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl mb-4">Sign Up</h1>

        <form
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
            {...register("email")}
            placeholder="Enter your email"
          />
          <label className="font-bold mt-3">CNIC</label>
          <input
            className="border border-gray-300 bg-amber-50 px-3"
            type="text"
            {...register("cnic")}
            placeholder="Enter your cnic"
          />
          <label className="font-bold mt-3">Phone</label>
          <input
            className="border border-gray-300 bg-amber-50 px-3"
            type="text"
            {...register("phone")}
            placeholder="Enter your number"
          />
          <label className="font-bold mt-3">Password</label>
          <input
            className="border border-gray-300 bg-amber-50 px-3"
            type="text"
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
          <label className="font-bold mt-3">Role</label>
          <select
            {...register("role")}
            className="border border-gray-300 bg-amber-50 px-3"
          >
            <option value="Buyer">Customer</option>
            <option value="Seller">Seller</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold mt-3 mx-auto w-1/2 px-auto rounded-md hover:bg-gray-600"
          >
            Create Account
          </button>
        </form>
      </div>
    </>
  );
}


export default Signup;
